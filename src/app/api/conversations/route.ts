import { NextResponse } from 'next/server'
import { z } from 'zod'
import { headers } from 'next/headers'
import { jwtVerify } from 'jose'
import connectDB from '@/lib/mongodb'
import { Conversation } from '@/models/Conversation'
import { User } from '@/models/User'
import { generateConversationResponse } from '@/services/openai'

const messageSchema = z.object({
  content: z.string().min(1),
  role: z.enum(['user', 'assistant']),
})

const conversationSchema = z.object({
  topic: z.string().min(1),
  difficultyLevel: z.enum(['beginner', 'intermediate', 'advanced']),
  aiPersona: z.enum(['teacher', 'conversation_partner', 'grammar_expert', 'pronunciation_coach']),
  message: messageSchema,
})

async function getUserId(token: string) {
  const secret = new TextEncoder().encode(process.env.JWT_SECRET)
  const { payload } = await jwtVerify(token, secret)
  return payload.userId as string
}

export async function POST(request: Request) {
  try {
    const headersList = headers()
    const token = headersList.get('authorization')?.split(' ')[1]
    if (!token) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const userId = await getUserId(token)
    const body = await request.json()
    const { topic, difficultyLevel, aiPersona, message } = conversationSchema.parse(body)

    await connectDB()

    // Get user's language level and preferences
    const user = await User.findById(userId)
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Get previous messages for context
    const previousConversation = await Conversation.findOne({
      userId,
      topic,
      difficultyLevel,
      aiPersona,
    }).sort({ 'conversationLog.timestamp': -1 }).limit(5)

    const previousMessages = previousConversation?.conversationLog
      .slice(-5)
      .map(msg => ({
        role: msg.role,
        content: msg.content,
      })) || []

    // Generate AI response using our service
    const aiResponse = await generateConversationResponse(
      {
        user,
        topic,
        difficultyLevel,
        aiPersona,
        previousMessages,
      },
      message.content
    )

    // Create or update conversation with structured feedback
    const conversation = await Conversation.findOneAndUpdate(
      {
        userId,
        topic,
        difficultyLevel,
        aiPersona,
      },
      {
        $push: {
          conversationLog: [
            {
              role: message.role,
              content: message.content,
              timestamp: new Date(),
            },
            {
              role: 'assistant',
              content: aiResponse.response,
              timestamp: new Date(),
              feedback: {
                accuracy: aiResponse.correction.hasError ? 80 : 100,
                issues: aiResponse.correction.hasError ? [aiResponse.correction.explanation] : [],
                positives: aiResponse.correction.hasError ? ['Good attempt!'] : ['Perfect!'],
                tips: aiResponse.newWords.map(word => 
                  `New word: ${word.word} - ${word.translation}. Example: ${word.example}`
                ),
              },
            },
          ],
        },
        $addToSet: {
          improvementAreas: aiResponse.correction.hasError ? aiResponse.correction.explanation : [],
        },
      },
      {
        upsert: true,
        new: true,
      }
    )

    // Update user's progress based on the interaction
    if (aiResponse.correction.hasError) {
      user.progress.grammarScore = Math.min(100, user.progress.grammarScore + 1)
    } else {
      user.progress.confidenceLevel = Math.min(100, user.progress.confidenceLevel + 2)
    }
    user.progress.lastActive = new Date()
    await user.save()

    return NextResponse.json({
      conversation,
      aiResponse,
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input data', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Conversation error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET(request: Request) {
  try {
    const headersList = headers()
    const token = headersList.get('authorization')?.split(' ')[1]
    if (!token) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const userId = await getUserId(token)
    const { searchParams } = new URL(request.url)
    const topic = searchParams.get('topic')
    const difficultyLevel = searchParams.get('difficultyLevel')
    const aiPersona = searchParams.get('aiPersona')

    await connectDB()

    // Build query
    const query: any = { userId }
    if (topic) query.topic = topic
    if (difficultyLevel) query.difficultyLevel = difficultyLevel
    if (aiPersona) query.aiPersona = aiPersona

    // Get conversations
    const conversations = await Conversation.find(query)
      .sort({ 'conversationLog.timestamp': -1 })
      .limit(10)

    return NextResponse.json({ conversations })
  } catch (error) {
    console.error('Get conversations error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 
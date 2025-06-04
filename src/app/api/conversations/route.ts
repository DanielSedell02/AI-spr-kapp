import { NextResponse } from 'next/server'
import { z } from 'zod'
import { headers } from 'next/headers'
import { jwtVerify } from 'jose'
import OpenAI from 'openai'
import connectDB from '@/lib/mongodb'
import { Conversation } from '@/models/Conversation'
import { User } from '@/models/User'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

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

    // Create system prompt based on user's level and preferences
    const systemPrompt = `You are a ${aiPersona} helping a ${user.languageLevel} level student learn ${user.targetLanguage}.
Their native language is ${user.nativeLanguage}.
Their interests include: ${user.interests.join(', ')}.
Their learning goals are: ${user.learningGoals.join(', ')}.

Guidelines:
1. Keep conversations related to their interests
2. Adapt vocabulary and grammar to their level
3. Correct mistakes kindly and explain why
4. Ask follow-up questions to keep the conversation going
5. Introduce 2-3 new words naturally per conversation
6. When they make a mistake, correct them like this: "Good try! Instead of '[wrong]' you can say '[correct]'. It means [explanation]."

Always respond in ${user.targetLanguage}, but explain difficult concepts in ${user.nativeLanguage} if needed.`

    // Get AI response
    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: message.role, content: message.content },
      ],
      temperature: 0.7,
      max_tokens: 150,
    })

    const aiResponse = completion.choices[0].message.content

    // Create or update conversation
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
              content: aiResponse,
              timestamp: new Date(),
            },
          ],
        },
      },
      {
        upsert: true,
        new: true,
      }
    )

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
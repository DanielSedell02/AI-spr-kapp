import { NextResponse } from 'next/server'
import { z } from 'zod'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import connectDB from '@/lib/mongodb'
import { User } from '@/models/User'

const signupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().min(2),
  nativeLanguage: z.string(),
  targetLanguage: z.string(),
  languageLevel: z.enum(['beginner', 'intermediate', 'advanced']),
  interests: z.array(z.string()).optional(),
  learningGoals: z.array(z.string()).optional(),
})

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const validatedData = signupSchema.parse(body)

    await connectDB()

    // Check if user already exists
    const existingUser = await User.findOne({ email: validatedData.email })
    if (existingUser) {
      return NextResponse.json(
        { error: 'User already exists' },
        { status: 400 }
      )
    }

    // Create new user
    const user = await User.create({
      ...validatedData,
      interests: validatedData.interests || [],
      learningGoals: validatedData.learningGoals || [],
    })

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET!,
      { expiresIn: '7d' }
    )

    // Return user data (excluding password) and token
    const { password: _, ...userData } = user.toObject()

    return NextResponse.json(
      {
        user: userData,
        token,
      },
      { status: 201 }
    )
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input data', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Signup error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 
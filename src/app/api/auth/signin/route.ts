import { NextResponse } from 'next/server'
import { z } from 'zod'
import jwt from 'jsonwebtoken'
import connectDB from '@/lib/mongodb'
import { User } from '@/models/User'

const signinSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
})

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email, password } = signinSchema.parse(body)

    await connectDB()

    // Find user by email
    const user = await User.findOne({ email })
    if (!user) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      )
    }

    // Verify password
    const isValidPassword = await user.comparePassword(password)
    if (!isValidPassword) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      )
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET!,
      { expiresIn: '7d' }
    )

    // Update last active timestamp
    user.progress.lastActive = new Date()
    await user.save()

    // Return user data (excluding password) and token
    const { password: _, ...userData } = user.toObject()

    return NextResponse.json({
      user: userData,
      token,
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input data', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Signin error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 
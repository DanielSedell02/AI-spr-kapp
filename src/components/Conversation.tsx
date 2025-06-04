import { useState, useRef, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

const messageSchema = z.object({
  content: z.string().min(1, 'Message cannot be empty'),
})

type Message = {
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

type ConversationProps = {
  topic: string
  difficultyLevel: 'beginner' | 'intermediate' | 'advanced'
  aiPersona: 'teacher' | 'conversation_partner' | 'grammar_expert' | 'pronunciation_coach'
  initialMessages?: Message[]
}

export default function Conversation({
  topic,
  difficultyLevel,
  aiPersona,
  initialMessages = [],
}: ConversationProps) {
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(messageSchema),
  })

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const onSubmit = async (data: { content: string }) => {
    try {
      setIsLoading(true)
      const userMessage: Message = {
        role: 'user',
        content: data.content,
        timestamp: new Date(),
      }

      // Add user message immediately
      setMessages((prev) => [...prev, userMessage])

      // Send to API
      const response = await fetch('/api/conversations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          topic,
          difficultyLevel,
          aiPersona,
          message: userMessage,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to send message')
      }

      const { aiResponse } = await response.json()

      // Add AI response
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: aiResponse,
          timestamp: new Date(),
        },
      ])

      reset()
    } catch (error) {
      console.error('Error sending message:', error)
      // You might want to show an error message to the user here
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex h-full flex-col">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${
              message.role === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            <div
              className={`max-w-[80%] rounded-lg px-4 py-2 ${
                message.role === 'user'
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 text-gray-900'
              }`}
            >
              <p className="text-sm">{message.content}</p>
              <p className="mt-1 text-xs opacity-70">
                {new Date(message.timestamp).toLocaleTimeString()}
              </p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input form */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="border-t border-gray-200 p-4"
      >
        <div className="flex space-x-4">
          <div className="flex-1">
            <input
              type="text"
              {...register('content')}
              placeholder="Type your message..."
              className="input-primary"
              disabled={isLoading}
            />
            {errors.content && (
              <p className="mt-1 text-sm text-red-600">
                {errors.content.message}
              </p>
            )}
          </div>
          <button
            type="submit"
            className="btn-primary"
            disabled={isLoading}
          >
            {isLoading ? 'Sending...' : 'Send'}
          </button>
        </div>
      </form>
    </div>
  )
} 
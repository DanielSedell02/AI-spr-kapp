import { useState, useRef, useEffect } from 'react'
import { useForm, SubmitHandler } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

const messageSchema = z.object({
  content: z.string().min(1, 'Message cannot be empty'),
})

type MessageFormData = z.infer<typeof messageSchema>

type Message = {
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  feedback?: {
    accuracy: number
    issues: string[]
    positives: string[]
    tips: string[]
  }
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
  } = useForm<MessageFormData>({
    resolver: zodResolver(messageSchema),
  })

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const onSubmit: SubmitHandler<MessageFormData> = async (data) => {
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

      const { aiResponse, conversation } = await response.json()

      // Add AI response with feedback
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: aiResponse.response,
          timestamp: new Date(),
          feedback: conversation.conversationLog[conversation.conversationLog.length - 1].feedback,
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
            <div className="flex flex-col max-w-[80%]">
              <div
                className={`rounded-lg px-4 py-2 ${
                  message.role === 'user'
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 text-gray-900'
                }`}
              >
                <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                <p className="mt-1 text-xs opacity-70">
                  {new Date(message.timestamp).toLocaleTimeString()}
                </p>
              </div>

              {/* Feedback section for AI messages */}
              {message.role === 'assistant' && message.feedback && (
                <div className="mt-2 space-y-2">
                  {/* Accuracy indicator */}
                  <div className="flex items-center space-x-2">
                    <div className="flex-1 h-2 bg-gray-200 rounded-full">
                      <div
                        className="h-2 bg-primary-500 rounded-full"
                        style={{ width: `${message.feedback.accuracy}%` }}
                      />
                    </div>
                    <span className="text-xs text-gray-500">
                      {message.feedback.accuracy}% accuracy
                    </span>
                  </div>

                  {/* Feedback details */}
                  {message.feedback.issues.length > 0 && (
                    <div className="text-sm text-red-600 bg-red-50 p-2 rounded">
                      <p className="font-medium">Areas for improvement:</p>
                      <ul className="list-disc list-inside">
                        {message.feedback.issues.map((issue, i) => (
                          <li key={i}>{issue}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {message.feedback.positives.length > 0 && (
                    <div className="text-sm text-green-600 bg-green-50 p-2 rounded">
                      <p className="font-medium">Well done!</p>
                      <ul className="list-disc list-inside">
                        {message.feedback.positives.map((positive, i) => (
                          <li key={i}>{positive}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {message.feedback.tips.length > 0 && (
                    <div className="text-sm text-blue-600 bg-blue-50 p-2 rounded">
                      <p className="font-medium">Learning tips:</p>
                      <ul className="list-disc list-inside">
                        {message.feedback.tips.map((tip, i) => (
                          <li key={i}>{tip}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
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
            {errors.content?.message && (
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
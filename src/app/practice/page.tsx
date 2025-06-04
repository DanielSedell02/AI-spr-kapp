'use client'

import { useState } from 'react'
import Conversation from '@/components/Conversation'

const topics = [
  'Daily Life',
  'Travel',
  'Food & Cooking',
  'Hobbies',
  'Work & Career',
  'Culture',
  'Technology',
  'Sports',
  'Health & Fitness',
  'Entertainment',
]

const personas = [
  {
    id: 'teacher',
    name: 'Language Teacher',
    description: 'A patient teacher who focuses on grammar and vocabulary',
  },
  {
    id: 'conversation_partner',
    name: 'Conversation Partner',
    description: 'A friendly chat partner for casual conversation practice',
  },
  {
    id: 'grammar_expert',
    name: 'Grammar Expert',
    description: 'Specializes in explaining grammar rules and usage',
  },
  {
    id: 'pronunciation_coach',
    name: 'Pronunciation Coach',
    description: 'Helps improve your accent and pronunciation',
  },
]

export default function PracticePage() {
  const [selectedTopic, setSelectedTopic] = useState(topics[0])
  const [selectedPersona, setSelectedPersona] = useState(personas[0].id)
  const [difficultyLevel, setDifficultyLevel] = useState<'beginner' | 'intermediate' | 'advanced'>('beginner')

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Practice Your Language Skills</h1>
        <p className="mt-2 text-gray-600">
          Choose a topic and persona to start a conversation. The AI will adapt to your level and provide personalized feedback.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
        {/* Settings panel */}
        <div className="space-y-6">
          <div>
            <label htmlFor="topic" className="block text-sm font-medium text-gray-700">
              Topic
            </label>
            <select
              id="topic"
              value={selectedTopic}
              onChange={(e) => setSelectedTopic(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-primary-500 focus:outline-none focus:ring-primary-500 sm:text-sm"
            >
              {topics.map((topic) => (
                <option key={topic} value={topic}>
                  {topic}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="persona" className="block text-sm font-medium text-gray-700">
              AI Persona
            </label>
            <select
              id="persona"
              value={selectedPersona}
              onChange={(e) => setSelectedPersona(e.target.value as typeof personas[0]['id'])}
              className="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-primary-500 focus:outline-none focus:ring-primary-500 sm:text-sm"
            >
              {personas.map((persona) => (
                <option key={persona.id} value={persona.id}>
                  {persona.name}
                </option>
              ))}
            </select>
            <p className="mt-1 text-sm text-gray-500">
              {personas.find((p) => p.id === selectedPersona)?.description}
            </p>
          </div>

          <div>
            <label htmlFor="difficulty" className="block text-sm font-medium text-gray-700">
              Difficulty Level
            </label>
            <select
              id="difficulty"
              value={difficultyLevel}
              onChange={(e) => setDifficultyLevel(e.target.value as typeof difficultyLevel)}
              className="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-primary-500 focus:outline-none focus:ring-primary-500 sm:text-sm"
            >
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>
        </div>

        {/* Conversation panel */}
        <div className="lg:col-span-3">
          <div className="h-[600px] rounded-lg border border-gray-200 bg-white shadow-sm">
            <Conversation
              topic={selectedTopic}
              difficultyLevel={difficultyLevel}
              aiPersona={selectedPersona as typeof personas[0]['id']}
            />
          </div>
        </div>
      </div>
    </div>
  )
} 
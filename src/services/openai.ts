import OpenAI from 'openai';
import { IUser } from '@/models/User';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export type AIPersona = 'teacher' | 'conversation_partner' | 'grammar_expert' | 'pronunciation_coach';

interface ConversationContext {
  user: IUser;
  topic: string;
  difficultyLevel: 'beginner' | 'intermediate' | 'advanced';
  aiPersona: AIPersona;
  previousMessages?: Array<{
    role: 'user' | 'assistant';
    content: string;
  }>;
}

export async function generateConversationResponse(
  context: ConversationContext,
  userMessage: string
) {
  const {
    user,
    topic,
    difficultyLevel,
    aiPersona,
    previousMessages = [],
  } = context;

  // Create system prompt based on user's level and preferences
  const systemPrompt = `You are a ${aiPersona} helping a ${difficultyLevel} level student learn ${user.targetLanguage}.
Their native language is ${user.nativeLanguage}.
Their interests include: ${user.interests.join(', ')}.
Their learning goals are: ${user.learningGoals.join(', ')}.

Guidelines:
1. Keep conversations related to their interests and the topic: ${topic}
2. Adapt vocabulary and grammar to their ${difficultyLevel} level
3. Correct mistakes kindly and explain why
4. Ask follow-up questions to keep the conversation going
5. Introduce 2-3 new words naturally per conversation
6. When they make a mistake, correct them like this: "Good try! Instead of '[wrong]' you can say '[correct]'. It means [explanation]."
7. Provide cultural context when relevant
8. Encourage active participation and practice

Always respond in ${user.targetLanguage}, but explain difficult concepts in ${user.nativeLanguage} if needed.

Format your response as JSON with the following structure:
{
  "response": "Your main response in the target language",
  "correction": {
    "hasError": boolean,
    "original": "The incorrect part (if any)",
    "corrected": "The correct version (if any)",
    "explanation": "Explanation of the correction (if any)"
  },
  "newWords": [
    {
      "word": "New word introduced",
      "translation": "Translation in native language",
      "example": "Example usage"
    }
  ],
  "culturalNote": "Optional cultural context or note"
}`;

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        { role: 'system', content: systemPrompt },
        ...previousMessages,
        { role: 'user', content: userMessage },
      ],
      temperature: 0.7,
      max_tokens: 500,
      response_format: { type: 'json_object' },
    });

    const response = completion.choices[0].message.content;
    if (!response) {
      throw new Error('No response from OpenAI');
    }

    return JSON.parse(response);
  } catch (error) {
    console.error('OpenAI API error:', error);
    throw error;
  }
}

export async function analyzePronunciation(audioText: string, targetLanguage: string) {
  const systemPrompt = `You are a pronunciation expert. Analyze the following text as if it was spoken by a language learner and provide detailed feedback.
Target language: ${targetLanguage}

Format your response as JSON with the following structure:
{
  "score": number (0-100),
  "feedback": {
    "strengths": ["List of pronunciation strengths"],
    "areasForImprovement": ["List of areas that need work"],
    "specificFeedback": ["Detailed feedback on specific sounds or patterns"]
  },
  "suggestions": ["Practical suggestions for improvement"]
}`;

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: audioText },
      ],
      temperature: 0.3,
      max_tokens: 300,
      response_format: { type: 'json_object' },
    });

    const response = completion.choices[0].message.content;
    if (!response) {
      throw new Error('No response from OpenAI');
    }

    return JSON.parse(response);
  } catch (error) {
    console.error('OpenAI API error:', error);
    throw error;
  }
}

export async function generateGrammarExercise(
  user: IUser,
  topic: string,
  difficultyLevel: 'beginner' | 'intermediate' | 'advanced'
) {
  const systemPrompt = `Create a grammar exercise for a ${difficultyLevel} level student learning ${user.targetLanguage}.
Their native language is ${user.nativeLanguage}.
Topic: ${topic}

Format your response as JSON with the following structure:
{
  "exercise": {
    "type": "fill-in-blank" | "multiple-choice" | "sentence-correction",
    "instructions": "Clear instructions in target language",
    "questions": [
      {
        "question": "The question or sentence",
        "options": ["Option 1", "Option 2", ...] (for multiple choice),
        "correctAnswer": "The correct answer",
        "explanation": "Explanation of the grammar rule"
      }
    ]
  },
  "grammarPoint": {
    "name": "Name of the grammar point",
    "explanation": "Detailed explanation in native language",
    "examples": ["Example 1", "Example 2", ...]
  }
}`;

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        { role: 'system', content: systemPrompt },
      ],
      temperature: 0.7,
      max_tokens: 500,
      response_format: { type: 'json_object' },
    });

    const response = completion.choices[0].message.content;
    if (!response) {
      throw new Error('No response from OpenAI');
    }

    return JSON.parse(response);
  } catch (error) {
    console.error('OpenAI API error:', error);
    throw error;
  }
} 
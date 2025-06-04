# AI-Driven Language Learning Application

A modern, AI-powered language learning application that provides personalized language learning experiences through natural conversations, pronunciation feedback, and adaptive learning paths.

## Features

- 🤖 AI-powered conversation practice with personalized feedback
- 🎯 Adaptive difficulty levels based on user progress
- 🗣️ Real-time pronunciation analysis and feedback
- 📚 Interactive stories and scenarios
- 📊 Progress tracking and analytics
- 🌍 Cultural context integration
- 🎮 Gamified learning experience

## Tech Stack

- **Frontend & Backend**: Next.js 14 with TypeScript
- **Database**: MongoDB
- **AI Services**:
  - OpenAI GPT-4 for conversations
  - Google Speech-to-Text for pronunciation
  - Google Translate for translations
  - ElevenLabs for text-to-speech
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Form Handling**: React Hook Form
- **Authentication**: JWT

## Prerequisites

- Node.js 18+ and npm
- MongoDB (local or Atlas)
- OpenAI API key
- Google Cloud credentials
- ElevenLabs API key

## Setup Instructions

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd ai-language-app
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory with the following variables:
   ```
   # MongoDB
   MONGODB_URI=mongodb://localhost:27017/ai-language-app

   # OpenAI
   OPENAI_API_KEY=your_openai_api_key_here

   # Google Cloud
   GOOGLE_APPLICATION_CREDENTIALS=path_to_your_google_credentials.json

   # JWT
   JWT_SECRET=your_jwt_secret_here

   # ElevenLabs
   ELEVENLABS_API_KEY=your_elevenlabs_api_key_here

   # Next.js
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
├── app/                 # Next.js app directory
├── components/          # React components
├── lib/                 # Utility functions and configurations
├── models/             # MongoDB models
├── services/           # External service integrations
└── types/              # TypeScript type definitions
```

## API Routes

- `/api/auth/*` - Authentication endpoints
- `/api/conversations/*` - Conversation management
- `/api/progress/*` - User progress tracking
- `/api/pronunciation/*` - Pronunciation analysis
- `/api/stories/*` - Interactive stories

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- OpenAI for GPT-4 API
- Google Cloud for Speech-to-Text and Translate APIs
- ElevenLabs for text-to-speech capabilities
- The open-source community for various tools and libraries 
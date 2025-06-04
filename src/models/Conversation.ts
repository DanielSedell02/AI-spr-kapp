import mongoose, { Schema, Document } from 'mongoose';

export interface IConversation extends Document {
  userId: mongoose.Types.ObjectId;
  aiPersona: string;
  topic: string;
  difficultyLevel: string;
  conversationLog: {
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
    feedback?: {
      accuracy: number;
      issues: string[];
      positives: string[];
      tips: string[];
    };
  }[];
  improvementAreas: string[];
  createdAt: Date;
  updatedAt: Date;
}

const ConversationSchema = new Schema<IConversation>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    aiPersona: {
      type: String,
      required: true,
      enum: ['teacher', 'conversation_partner', 'grammar_expert', 'pronunciation_coach'],
    },
    topic: {
      type: String,
      required: true,
      trim: true,
    },
    difficultyLevel: {
      type: String,
      required: true,
      enum: ['beginner', 'intermediate', 'advanced'],
    },
    conversationLog: [{
      role: {
        type: String,
        enum: ['user', 'assistant'],
        required: true,
      },
      content: {
        type: String,
        required: true,
      },
      timestamp: {
        type: Date,
        default: Date.now,
      },
      feedback: {
        accuracy: {
          type: Number,
          min: 0,
          max: 100,
        },
        issues: [String],
        positives: [String],
        tips: [String],
      },
    }],
    improvementAreas: [{
      type: String,
      trim: true,
    }],
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
ConversationSchema.index({ userId: 1, createdAt: -1 });

export const Conversation = mongoose.models.Conversation || mongoose.model<IConversation>('Conversation', ConversationSchema); 
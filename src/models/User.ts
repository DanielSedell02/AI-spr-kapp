import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
  email: string;
  password: string;
  name: string;
  nativeLanguage: string;
  targetLanguage: string;
  languageLevel: string;
  interests: string[];
  learningGoals: string[];
  progress: {
    vocabularyScore: number;
    grammarScore: number;
    pronunciationScore: number;
    confidenceLevel: number;
    lastActive: Date;
  };
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const UserSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    nativeLanguage: {
      type: String,
      required: true,
    },
    targetLanguage: {
      type: String,
      required: true,
    },
    languageLevel: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced'],
      default: 'beginner',
    },
    interests: [{
      type: String,
      trim: true,
    }],
    learningGoals: [{
      type: String,
      trim: true,
    }],
    progress: {
      vocabularyScore: {
        type: Number,
        default: 0,
        min: 0,
        max: 100,
      },
      grammarScore: {
        type: Number,
        default: 0,
        min: 0,
        max: 100,
      },
      pronunciationScore: {
        type: Number,
        default: 0,
        min: 0,
        max: 100,
      },
      confidenceLevel: {
        type: Number,
        default: 0,
        min: 0,
        max: 100,
      },
      lastActive: {
        type: Date,
        default: Date.now,
      },
    },
  },
  {
    timestamps: true,
  }
);

// Hash password before saving
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error: any) {
    next(error);
  }
});

// Method to compare password
UserSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

export const User = mongoose.models.User || mongoose.model<IUser>('User', UserSchema); 
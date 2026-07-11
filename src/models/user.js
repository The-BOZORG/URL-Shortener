import { Schema, model } from 'mongoose';

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    role: {
      type: String,
      required: true,
      enum: {
        values: ['user', 'admin'],
        message: '`{value}` is not supported',
      },
    },
    totalVisitCount: {
      type: Number,
      default: 0,
    },
    passwordResetToken: {
      type: String,
      default: null,
      select: false,
    },
    refreshToken: {
      type: String,
      default: null,
      select: false,
    },
  },
  { timestamps: true },
);

export const User = model('User', userSchema);

import { Schema, model } from 'mongoose';

const linkSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    destination: {
      type: String,
      required: true,
    },
    backHalf: {
      type: String,
      required: true,
      unique: true,
    },
    shortLink: {
      type: String,
      required: true,
    },
    totalVisitCount: {
      type: Number,
      default: 0,
    },
    creator: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true },
);

export const Link = model('Link', linkSchema);

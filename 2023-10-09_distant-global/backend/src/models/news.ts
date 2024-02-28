import mongoose from "mongoose";
import User from "./user";
import File, { IFile } from "./file";

export interface INews {
  _id: mongoose.Schema.Types.ObjectId;
  text: string;
  owner: mongoose.Schema.Types.ObjectId;
  published: boolean;
  publishedAt: Date;
  files: mongoose.Schema.Types.ObjectId[] | IFile[];
}

const newsSchema = new mongoose.Schema<INews>(
  {
    text: {
      type: mongoose.Schema.Types.String,
      required: true,
    },
    published: {
      type: mongoose.Schema.Types.Boolean,
      required: true,
    },
    publishedAt: {
      type: mongoose.Schema.Types.Date,
      default: Date.now,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: User.modelName,
    },
    files: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: File.modelName,
      default: [],
    },
  },
  {
    versionKey: false,
    timestamps: {
      createdAt: true,
      updatedAt: true,
    },
    toJSON: { useProjection: true },
    toObject: { useProjection: true },
  },
);

export default mongoose.model<INews>("news", newsSchema);

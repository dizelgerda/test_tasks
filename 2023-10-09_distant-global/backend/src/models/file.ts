import mongoose from "mongoose";

export interface IFile {
  _id: mongoose.Schema.Types.ObjectId;
  name: string;
  type: string;
  newsID: mongoose.Schema.Types.ObjectId;
}

const fileSchema = new mongoose.Schema<IFile>(
  {
    name: {
      type: mongoose.Schema.Types.String,
      required: true,
    },
    type: {
      type: mongoose.Schema.Types.String,
      required: true,
    },
    newsID: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
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

export default mongoose.model<IFile>("file", fileSchema);

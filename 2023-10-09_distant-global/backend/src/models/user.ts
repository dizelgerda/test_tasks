import mongoose from "mongoose";

export interface IUser {
  _id: mongoose.Schema.Types.ObjectId;
  name: string;
  email: string;
  password: string;
}

const userSchema = new mongoose.Schema<IUser>(
  {
    name: {
      type: mongoose.Schema.Types.String,
      require: true,
    },
    email: {
      type: mongoose.Schema.Types.String,
      require: true,
      unique: true,
    },
    password: {
      type: mongoose.Schema.Types.String,
      require: true,
      select: false,
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

export default mongoose.model<IUser>("user", userSchema);

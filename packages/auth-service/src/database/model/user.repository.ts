import mongoose, { Document, Model } from "mongoose";

export interface IAuth {
  username: string,
  email: string;
  role: string;
  isVerified?: boolean;
}
export interface IAuthDocument extends Document {
  authId?: string;
  username: string;
  email: string;
  password: string;
  role: string;
  isVerified?: boolean;
  googleId?: string;
}

export interface IAuthModel extends Model<IAuthDocument> {}

const authSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
    },
    role: {
      type: String,
      required: true,
      enum: ["seeker","employer"],
      default: "seeker",
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    googleId: {
      type: String,
      unique: true,
      sparse: true,
    },
  },
  {
    toJSON: {
      transform(_doc, ret) {
        delete ret.password;
        delete ret.googleId;
        delete ret.__v;
      },
    },
  }
);

const  authentication = mongoose.model<IAuthDocument, IAuthModel>(
  "authentication",
  authSchema
);

export default  authentication;

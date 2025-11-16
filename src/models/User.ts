import mongoose, { Schema, Document, models } from "mongoose";

export interface IUser extends Document {
  email: string;
  pw: string;
  favoriteKeywords: string[];
}

const UserSchema = new Schema<IUser>(
  {
    email: { type: String, required: true },
    pw: { type: String, required: true },
    favoriteKeywords: { type: [String], default: [] },
  },
  {
    collection: "myapp" // ← 컬렉션 이름 강제 지정
  }
);

const User = models.User || mongoose.model<IUser>("User", UserSchema);
export default User;

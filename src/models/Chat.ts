import { model, Schema } from "mongoose";

export interface IChat {
  userId: Schema.Types.ObjectId;
  text: string;
  response: string;
}

const chatSchema = new Schema<IChat>({
  userId: { type: Schema.Types.ObjectId, required: true, ref: "User" },
  text: { type: String, required: true },
  response: { type: String, required: true },
});

export const Chat = model<IChat>("Chat", chatSchema);

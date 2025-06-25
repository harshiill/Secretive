import mongoose, { Document, Schema } from 'mongoose';

export interface Message extends Document {
    content : string;
    createdAt: Date;
}

const messageSchema : Schema<Message> = new Schema({
    content: { type: String, required: true },
    createdAt: { type: Date, default: Date.now ,required: true }
})

export interface User extends Document {
    username: string;
    email: string;
    password: string;
    verifyCode : string;
    verifyCodeExpiry: Date;
    isVerified : boolean;
    isAcceptingMessages: boolean;
    messages : Message[];
}

 const userSchema : Schema<User> = new mongoose.Schema({
    username: { type: String, required: true, unique: true ,trim: true },
    email: { type: String, required: true, unique: true , match : [/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,"Please use a valid Email Address"] },
    password: { type: String, required: true },
    verifyCode: { type: String, required: true },
    verifyCodeExpiry: { type: Date, required: true },
    isAcceptingMessages: { type: Boolean, default: true },
    messages: [messageSchema],
    isVerified: { type: Boolean, default: false }
 });

  const UserModel = mongoose.models.users as mongoose.Model<User>|| mongoose.model<User>('users', userSchema);

  export default UserModel;

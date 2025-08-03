import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/user.model";
import { NextRequest, NextResponse } from "next/server";
import { Message } from "@/models/user.model";

export async function POST( req : NextRequest)
{
    await dbConnect();

   const {username,content}= await req.json();

   try {
   const user= await  UserModel.findOne({username})
   if(!user) {
       return NextResponse.json({
           success: false,
           message: "User not found."
       }, {status: 404});

    }

    if(!user.isAcceptingMessages) {
         return NextResponse.json({
              success: false,
              message: "User is not accepting messages."
         }, {status: 403});

    }

    const message = {
        content: content,
        createdAt: new Date()
    }
    user.messages.push(message as Message);
    await user.save();

    return NextResponse.json({
        success: true,
        message: "Message sent successfully."
    }, {status: 200});
   } catch (error) {
         console.error("Error sending message:", error);
         return NextResponse.json({
              success: false,
              message: "An error occurred while sending the message."
         }, {status: 500});
    
   }
}
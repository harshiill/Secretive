import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/user.model";
import { User } from "next-auth";
import { NextRequest } from "next/server";

export async function POST(req : NextRequest)
{
   await dbConnect();
   const session = await  getServerSession(authOptions);
   const user  = session?.user as User;

   if(!session || !session.user)
   {
        return Response.json({
            success: false,
            message: "You must be signed in to accept messages."
        }, {status: 401});
   }
   
   const userId = user._id;
   const {acceptMessages}= await req.json()
    try {
      const updatedUser=  await UserModel.findByIdAndUpdate(userId, {
            isAcceptingMessages: acceptMessages
        }, {
            new: true,
        });

        if(!updatedUser) {
            return Response.json({
                success: false,
                message: "User not found."
            }, {status: 404});
        }
        

        return Response.json({
            success: true,
            message: `You have ${acceptMessages ? "accepted" : "declined"} messages successfully.`
        }, {status: 200}
        )
    } catch (error) {
        console.error("Error in accept-message route:", error);
        return Response.json({
            success: false,
            message: "An error occurred while processing your request."
        }, {status: 500});
        
    }
}
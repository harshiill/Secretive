/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/user.model";
import { NextRequest,NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/options";
import { getServerSession } from "next-auth";
import mongoose from "mongoose";


export async function DELETE(req : NextRequest,context: any)
{
const messageId = context.params.messageId;   
 await dbConnect();
    const session = await getServerSession(authOptions);
    const user = session?.user;

    if(!session || !user) {
        return NextResponse.json({
            success: false,
            message: "You must be signed in to get messages."
        }, {status: 401});
    }

    try {
       const updateResult = await UserModel.updateOne(
            {_id: user._id},
            {$pull: {messages: {_id: messageId}}}
        )

        if(updateResult.modifiedCount === 0) {
            return NextResponse.json({
                success: false,
                message: "Failed to delete message."
            }, {status: 500});
        }

        return NextResponse.json({
            success: true,
            message: "Message deleted successfully."
        });
    } catch (error) {
        
    }


  
}
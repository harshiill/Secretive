/* eslint-disable @typescript-eslint/no-unused-vars */
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/user.model";
import { NextRequest,NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/options";
import { getServerSession } from "next-auth";
import mongoose from "mongoose";


export async function GET(req : NextRequest)
{
    await dbConnect();
    const session = await getServerSession(authOptions);
    const user = session?.user;

    if(!session || !user) {
        return NextResponse.json({
            success: false,
            message: "You must be signed in to get messages."
        }, {status: 401});
    }

    const userId = new mongoose.Types.ObjectId(user._id);

    try {
        const user= await UserModel.aggregate([
            {
                $match:{
                    _id: userId
                    
                }
            },
            {
                
                    $unwind: "$messages"
                
            },
            {
                $sort:{
                    "messages.createdAt": -1
                }
            },
            {
                $group:{
                    _id: "$_id",
                    messages: { $push: "$messages" }
                }
            }
                
            
        ])

        if(user.length === 0) {
            return NextResponse.json({
                success: false,
                message: "No messages found."
            }, {status: 404});
        }
        return NextResponse.json({
            success: true,
            messages: user[0].messages
        }, {status: 200});
    } catch (error) {
        console.error("Error in get-messages route:", error);
        return NextResponse.json({
            success: false,
            message: "An error occurred while fetching messages."
        }, {status: 500});
    }
}
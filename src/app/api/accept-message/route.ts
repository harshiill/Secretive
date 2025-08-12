/* eslint-disable @typescript-eslint/no-unused-vars */
import { getServerSession } from "next-auth";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/user.model";
import { User } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/options";
import mongoose from "mongoose";

export async function POST(req: NextRequest) {
  await dbConnect();
  const session = await getServerSession(authOptions);
  const user = session?.user as User;

  console.log("Session:", session);
  console.log("User:", user);

  if (!session || !session.user) {
    return NextResponse.json(
      { success: false, message: "You must be signed in to accept messages." },
      { status: 401 }
    );
  }

  if (!user._id) {
    console.log("User ID is missing from session");
    return NextResponse.json(
      { success: false, message: "User ID not found in session." },
      { status: 401 }
    );
  }

  const userId = new mongoose.Types.ObjectId(user._id);
  console.log("User ID:", userId);
  const { acceptMessages } = await req.json();

  if (typeof acceptMessages !== "boolean") {
    return NextResponse.json(
      { success: false, message: "Invalid acceptMessages value." },
      { status: 400 }
    );
  }

  try {
    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      { isAcceptingMessages: acceptMessages },
      { new: true }
    );

    if (!updatedUser) {
      return NextResponse.json(
        { success: false, message: "User not found." },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: `You have ${
          acceptMessages ? "accepted" : "declined"
        } messages successfully.`,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in accept-message route:", error);
    return NextResponse.json(
      {
        success: false,
        message: "An error occurred while processing your request.",
      },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  await dbConnect();
  const session = await getServerSession(authOptions);
  const user = session?.user as User;

  console.log("GET Session:", session);
  console.log("GET User:", user);

  if (!session || !session.user) {
    return NextResponse.json(
      { success: false, message: "You must be signed in to accept messages." },
      { status: 401 }
    );
  }

  if (!user._id) {
    console.log("GET: User ID is missing from session");
    return NextResponse.json(
      { success: false, message: "User ID not found in session." },
      { status: 401 }
    );
  }

  const userId = new mongoose.Types.ObjectId(user._id);
  console.log("GET User ID:", userId);

  try {
    const foundUser = await UserModel.findById(userId, "isAcceptingMessages");

    if (!foundUser) {
      return NextResponse.json(
        { success: false, message: "User not found." },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Accept messages status fetched successfully.",
        isAcceptingMessages: foundUser.isAcceptingMessages,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in accept-message route:", error);
    return NextResponse.json(
      {
        success: false,
        message: "An error occurred while processing your request.",
      },
      { status: 500 }
    );
  }
}

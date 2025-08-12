/* eslint-disable @typescript-eslint/no-explicit-any */
import {NextAuthOptions} from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from "bcryptjs";
import UserModel from "@/models/user.model";
import dbConnect from "@/lib/dbConnect";

export const authOptions : NextAuthOptions = {
    providers:[
        CredentialsProvider({
            id: "credentials",
            name: "Credentials",
             credentials: {
      email: { label: "Email", type: "text" },
      password: { label: "Password", type: "password" }
    },

    async authorize(credentials : any) : Promise<any> {
        await dbConnect();
        try {
            const user=await UserModel.findOne({
                email: credentials.identifier
            })

            console.log("Found user in authorize:", user);

            if(!user)
            {
                throw new Error("No user found with the provided email.");
            }

            if(!user.isVerified)
            {
                throw new Error("User is not verified. Please verify your email.");
            }

            const isPasswordCorrect=await bcrypt.compare(credentials.password, user.password)

            if(!isPasswordCorrect)
            {
                throw new Error("Incorrect password. Please try again.");
            }

            console.log("Returning user:", user);
            return user;

        } catch (error : any) {
            throw new Error(error.message || "An error occurred during authorization.");
            
        }
        }})


    ],
    callbacks:{
    async session({ session ,token }) {
        console.log("Session callback - token:", token);
        if(token) {
            session.user._id = token._id as string;
            session.user.username = token.username as string | undefined;
            session.user.isVerified = token.isVerified as boolean | undefined;
            session.user.isAcceptingMessages = token.isAcceptingMessages as boolean | undefined;
        }
        console.log("Session callback - session after setting:", session);
      return session
    },
    async jwt({ token, user }) {
        if(user)
        {
            console.log("JWT callback - user:", user);
            token._id = user._id?.toString();
            token.username = user.username;
            token.isVerified = user.isVerified;
            token.isAcceptingMessages = user.isAcceptingMessages;
            console.log("JWT callback - token after setting:", token);
        }
      return token;
    }
    },

    pages: {
        signIn: "/sign-in",
        
    },
    session:{
        strategy: "jwt"
    },
    secret: process.env.NEXTAUTH_SECRET,
}
import {NextAuthOptions} from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from "bcryptjs";
import {dbConnect} from "@/lib/dbConnect";
import UserModel from "@/models/user.model";

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
                email: credentials.identifier.email
            })

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

            return user;

        } catch (error : any) {
            throw new Error(error.message || "An error occurred during authorization.");
            
        }
        })


    ],

    pages: {
        signIn: "/sign-in",
        error: "/auth/sign-in"
    }
}
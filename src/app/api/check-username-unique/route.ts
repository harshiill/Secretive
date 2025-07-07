import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/user.model";
import {z} from "zod";
import { usernameValidation } from "@/schemas/signUpSchema";


 const UsernameQuerySchema = z.object({
    username: usernameValidation
 }) 

 export async function GET (request : Request){
    dbConnect();

    try {
        const {searchParams} = new URL(request.url);
        const queryParam = {
            username: searchParams.get("username")
        }

        // Validate the query parameter
        const result = UsernameQuerySchema.safeParse(queryParam);

        if(!result.success) {
            const usernameErrors = result.error.format().username?._errors || []
           return Response.json({
                success: false,
                message : usernameErrors.length > 0 ? usernameErrors?.join(",") : "Invalid username format."
            },{
                status: 400
            })
        }

        const {username} = result.data;

        const existingVerifiedUser=await UserModel.findOne({username,isVerified: true})

        if(existingVerifiedUser) {
            return Response.json({
                success: false,
                message: "Username is already taken by a verified user."
            }, {status: 409});
        }

        return Response.json({
            success: true,
            message: "Username is unique."
        }, {status: 200});

    } catch (error) {
        console.error("Error checking username uniqueness:", error);
        return Response.json({
            success: false,
            message: "An error occurred while checking username uniqueness."
        }, {status: 500});
        
    }
 }
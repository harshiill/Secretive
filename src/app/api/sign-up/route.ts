import { sendEmail } from "@/helpers/mailer";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/user.model";
import bcrypt from "bcryptjs";



export async function POST(request : Request)
{
    dbConnect();
    try {
        const { username, email, password } = await request.json();

        const exsistingUserVerifiedByUsername=await UserModel.findOne({
            username,
            isVerified:true
        })

        if(exsistingUserVerifiedByUsername)
        {
            return Response.json({
                success: false,
                message: "Username already exists. Please choose a different username."
            },{
                status: 400
            })
        }

        const exsistingUserVerifiedByEmail=await UserModel.findOne({
            email,
        })

        const verifyCode = Math.floor(100000 + Math.random() * 900000).toString(); // Generate a 6-digit OTP

        if(exsistingUserVerifiedByEmail)
        {
            if(exsistingUserVerifiedByEmail.isVerified)
            {
               return Response.json({
                success: false,
                message: "Email already exists. Please choose a different email."
            },{
                status: 500
            })  
            }
            // If user exists but is not verified, update the existing user
            else
            {
                const hashedPassword = await bcrypt.hash(password, 10);
                const expiryDate = new Date();
                expiryDate.setHours(expiryDate.getHours() + 1); // Set expiry to
                // 1 hour from now
                await UserModel.updateOne(
                    { email: exsistingUserVerifiedByEmail.email },
                    {
                        username,
                        password: hashedPassword,
                        verifyCode: verifyCode,
                        verifyCodeExpiry: expiryDate,
                        isVerified: false,
                        isAcceptingMessages: true,
                        messages: []
                    },
                    { runValidators: true }
                );

            }
        }
        else
        {
            const hashedPassword=await bcrypt.hash(password,10);
            const expiryDate = new Date();
            expiryDate.setHours(expiryDate.getHours() + 1); 

           const newUser= new UserModel({
                 username,
                 email,
                    password: hashedPassword,
                    verifyCode : verifyCode,
                    verifyCodeExpiry: expiryDate,
                    isVerified : false,
                    isAcceptingMessages: true,
                    messages : [],
            })

            await newUser.save({validateBeforeSave: false});
        }

        //send verification email
        const emailResponse = await sendEmail({
            email,
            emailType: "verify",
            username,
            otp: verifyCode
        });

        if (!emailResponse.accepted || emailResponse.accepted.length === 0)
        {
            return Response.json({
                success: false,
                message: "Failed to send verification email."
            },{
                status: 500
            })
        }

        return Response.json({
                success: true,
                message: "User registered successfully. Please check your email for the verification code.",
            },{
                status: 201
            })

    } catch (error) {
        console.error("Error Registering User:", error);
        return Response.json({
            success: false,
            message: "Failed to register user. Please try again later."
        },{
            status: 500
        })
    }
}
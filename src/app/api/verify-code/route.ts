import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/user.model";


export async function POST(request : Request)
{
dbConnect();
try {
    const {username,code} = await request.json();

    const decodedUsername = decodeURIComponent(username);

   if(!username || !code) {
        return Response.json({
            success: false,
            message: "Username and code are required."
        }, {status: 400});
    }

    const user=await UserModel.findOne({username : decodedUsername})

    if(!user) {
        return Response.json({
            success: false,
            message: "User not found."
        }, {status: 404});
    }

    if(user.isVerified) {
        return Response.json({
            success: false,
            message: "User is already verified."
        }, {status: 400});
    }

    const isCodeValid = user.verifyCode === code;
    const isCodeNotExpired = new Date(user.verifyCodeExpiry) > new Date();

    if(isCodeValid || isCodeNotExpired) {
        user.isVerified = true;
       
        await user.save({validateBeforeSave: false});

        return Response.json({
            success: true,
            message: "User verified successfully."
        }, {status: 200});

    }

    else if(!isCodeNotExpired)
    {
        return Response.json({
            success: false,
            message: "Verification code has expired. Please Sign Up again."
        }, {status: 400});
    }
    else {
        return Response.json({
            success: false,
            message: "Invalid verification code."
        }, {status: 400});
    }

   
    

     
} catch (error) {
    console.error("Error in verify code route:", error);
    return Response.json({
        success: false,
        message: "An error occurred while verifying the code."
    }, {status: 500});
    
}
}
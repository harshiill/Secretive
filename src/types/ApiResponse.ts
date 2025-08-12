import { Message } from "@/models/user.model";
export interface ApiResponse{
    success: boolean;
    message: string;
   isAcceptingMessages?: boolean | false;
   messages?: Array<Message>;
}
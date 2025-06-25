import {z} from 'zod';

export const messageSchema = z.object({
    content: z.string().min(10, { message: "Message content must be of atleast 10 charactars" }).max(300, { message: "Message content must be at most 300 characters long" }),
})


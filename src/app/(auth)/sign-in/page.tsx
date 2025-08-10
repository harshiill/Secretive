/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'
import {z} from 'zod'
import { useForm} from 'react-hook-form'
import {zodResolver} from '@hookform/resolvers/zod'
import { Link } from '@react-email/components'
import axios, { AxiosError } from 'axios'
import { useEffect, useState } from 'react'
import { useDebounceCallback, useDebounceValue } from 'usehooks-ts'
import { toast } from "sonner"
import { useRouter } from 'next/navigation'
import { set } from 'mongoose'
import { ApiResponse } from '@/types/ApiResponse'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Loader2 } from 'lucide-react'
import { signInSchema } from '@/schemas/signInSchema'
import { signIn } from 'next-auth/react'


function Page() {
  
  const [isSubmitting, setSubmitting] = useState(false)


  const router = useRouter();

  //zod implementation
  const form=useForm<z.infer<typeof signInSchema>>({ 
    resolver: zodResolver(signInSchema),
    defaultValues:{
      identifier:"",
      password:""

    }
  })

 

   const onSubmit=async (data : z.infer<typeof signInSchema>) => {
        const res=await signIn('credentials',{
            redirect: false,
            identifier:data.identifier,
            password:data.password

        })
        if(res?.error) {
            toast.error(res.error)
        } 
        if(res?.url)
        {
            router.replace('/dashboard')
        }
   }
  return (
   <div className="flex justify-center items-center min-h-screen bg-gray-800">
    <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className='text-center'>
            <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
                Join Secreative
            </h1>
            <p className='mb-4'> Sign in to start your anonymous adventure</p>

        </div>
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
             <FormField
          control={form.control}
          name="identifier"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="Enter your Email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
             <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type='password' placeholder="Enter your Password" {...field}  />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isSubmitting}>{
            isSubmitting ? (
                <>
             <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please Wait 
                </>
            ) : ("Signin")
}</Button>
            </form>

        </Form>
        
    </div>

   </div>
  )
}

export default Page
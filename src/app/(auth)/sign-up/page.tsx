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
import { signUpSchema } from '@/schemas/signUpSchema'
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


function Page() {
  const [username, setUsername] = useState('')
  const [usernameMessage, setUsernameMessage] = useState('')
  const [isCheckingUsername, setCheckingUsername] = useState(false)
  const [isSubmitting, setSubmitting] = useState(false)

  const debounced=useDebounceCallback(setUsername, 300)

  const router = useRouter();

  //zod implementation
  const form=useForm<z.infer<typeof signUpSchema>>({ 
    resolver: zodResolver(signUpSchema),
    defaultValues:{
        username:"",
      email:"",
      password:""

    }
  })

   useEffect(()=>{
     if (!username.trim()) return;
    const checkUsername = async () => { 
    setCheckingUsername(true)
    setUsernameMessage('')
    try {
      const res=await axios.get(`/api/check-username-unique?username=${username}`)
      setCheckingUsername(false)
      if(res.data.success) {
        setUsernameMessage("Username is available.")
      } else {
        setUsernameMessage(res.data.message)
      }
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>
      setUsernameMessage(axiosError.response?.data.message || "An error occurred.")
      setCheckingUsername(false)
    }
    finally{
        setCheckingUsername(false)
    }
  }

  checkUsername();
   },[username])

   const onSubmit=async (data : z.infer<typeof signUpSchema>) => {
        setSubmitting(true)
        try {
            const res=await axios.post<ApiResponse>('/api/sign-up', data)
            if(res.data.success) {
                toast.success(res.data.message)
                router.push(`/verify/${username}`)
            }
        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>
            toast.error(axiosError.response?.data.message || "An error occurred.")
        } finally {
            setSubmitting(false)
        }
   }
  return (
   <div className="flex justify-center items-center min-h-screen bg-gray-800">
    <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className='text-center'>
            <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
                Join True Feedback
            </h1>
            <p className='mb-4'> Sign up to start your anonymous adventure</p>

        </div>
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
             <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="Enter your Username" {...field} onChange={(e) => {
                    field.onChange(e)
                    debounced(e.target.value)
                }} />
                </FormControl>
                 {isCheckingUsername && <Loader2 className="animate-spin" />}
                  {!isCheckingUsername && usernameMessage && (
                    <p
                      className={`text-sm ${
                        usernameMessage === 'Username is unique.'
                          ? 'text-green-500'
                          : 'text-red-500'
                      }`}
                    >
                      {usernameMessage}
                    </p>
                  )}
              
              <FormMessage />
            </FormItem>
          )}
        />
             <FormField
          control={form.control}
          name="email"
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
            ) : ("Signup")
}</Button>
            </form>

        </Form>
        <div className="text-center mt-4">
          <p>
            Already a member?{' '}
            <Link href="/sign-in" className="text-blue-600 hover:text-blue-800">
              Sign in
            </Link>
          </p>
        </div>
    </div>

   </div>
  )
}

export default Page
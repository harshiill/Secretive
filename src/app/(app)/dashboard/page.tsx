/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'
import React, { useCallback, useEffect, useState } from 'react'
import { Message } from '@/models/user.model';
import { toast } from 'sonner';
import { useSession } from 'next-auth/react';
import { useForm } from 'react-hook-form';
import { AcceptMessageSchema } from '@/schemas/acceptMessageSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import axios, { AxiosError } from 'axios';
import { ApiResponse } from '@/types/ApiResponse';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Loader2, RefreshCcw } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import MessageCard from '@/components/MeesageCard';
import { User } from 'next-auth';

function Dashboard() {

    const [messages,setMessages] = useState<Message[]>([])
    const [isLoading,setIsLoading] = useState<boolean>(false)
    const [isSwitchLoading,setIsSwitchLoading] = useState<boolean>(false)
    const handleDeleteMessage = (messageId: string) => {
    setMessages(messages.filter((message) => message._id !== messageId));
  };

const {data : session, status} = useSession();

const form= useForm({
    resolver: zodResolver(AcceptMessageSchema),
    defaultValues: {
    acceptMessages: false
  }
}
)

const {register,watch,setValue} = form;

const acceptMessages = watch('acceptMessages');

const fetchAcceptMessages = useCallback(async () => {
    setIsSwitchLoading(true)

    try {
        const res=await axios.get<ApiResponse>('/api/accept-message')
        setValue('acceptMessages', res.data.isAcceptingMessages ?? false);        
        toast.success(res.data.message)
    } catch (error) {
        const axiosError = error as AxiosError<ApiResponse>;
        toast.error(axiosError.response?.data.message || 'An error occurred');
    }
    finally{
        setIsSwitchLoading(false)
    }
},[setValue])   

const fetchMessages= useCallback(async (refresh : boolean =false) => {
    setIsLoading(true)
    setIsSwitchLoading(false   )

    try {
        const res=await axios.get<ApiResponse>('/api/get-messages')
        setMessages(res.data.messages || [])

        if(refresh) {
            toast.success("Messages refreshed successfully")
        }
    } catch (error) {
        const axiosError = error as AxiosError<ApiResponse>;
        toast.error(axiosError.response?.data.message || 'An error occurred');
    }
    finally{
        setIsLoading(false)
    }
},[setIsLoading,setMessages])

useEffect(() => {
    if(!session || !session.user) {
        console.log("No session or user found");
        return;
    }

    console.log("Session user:", session.user);
    fetchAcceptMessages()
    fetchMessages()
},[session,setValue,fetchAcceptMessages,fetchMessages])

const handleSwitchChange = async () => {
    setIsSwitchLoading(true);
    try {
        const response = await axios.post<ApiResponse>('/api/accept-message', {
            acceptMessages: !acceptMessages,
        });
        setValue('acceptMessages', !acceptMessages);
        toast.success(response.data.message || 'Message acceptance setting updated successfully');
    } catch (error) {
        const axiosError = error as AxiosError<ApiResponse>;
        toast.error(axiosError.response?.data.message || 'An error occurred while updating settings');
    } finally {
        setIsSwitchLoading(false);
    }
}

// Show loading while session is being fetched
if(status === 'loading') {
    return (
        <div className="flex justify-center items-center min-h-screen">
            <Loader2 className="h-8 w-8 animate-spin" />
            <span className="ml-2">Loading...</span>
        </div>
    )
}

// Redirect to login if no session (this should be handled by middleware, but just in case)
if(status === 'unauthenticated' || !session || !session.user) {
    return (
        <div className="flex justify-center items-center min-h-screen">
            <div className="text-center">
                <h2 className="text-2xl font-bold mb-4">Please Login</h2>
                <Button onClick={() => window.location.href = '/sign-in'}>
                    Go to Login
                </Button>
            </div>
        </div>
    )
}

const { username } = session.user as User;

  const baseUrl = `${window.location.protocol}//${window.location.host}`;
  const profileUrl = `${baseUrl}/u/${username}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(profileUrl);
   toast.success('Link copied to clipboard!');
  };

  return (
     <div className="my-8 mx-4 md:mx-8 lg:mx-auto p-6 bg-white rounded w-full max-w-6xl">
      <h1 className="text-4xl font-bold mb-4">User Dashboard</h1>

      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-2">Copy Your Unique Link</h2>{' '}
        <div className="flex items-center">
          <input
            type="text"
            value={profileUrl}
            disabled
            className="input input-bordered w-full p-2 mr-2"
          />
          <Button onClick={copyToClipboard}>Copy</Button>
        </div>
      </div>

      <div className="mb-4">
        <Switch
          {...register('acceptMessages')}
          checked={acceptMessages}
          onCheckedChange={handleSwitchChange}
          disabled={isSwitchLoading}
        />
        <span className="ml-2">
          Accept Messages: {acceptMessages ? 'On' : 'Off'}
        </span>
      </div>
      <Separator />

      <Button
        className="mt-4"
        variant="outline"
        onClick={(e) => {
          e.preventDefault();
          fetchMessages(true);
        }}
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <RefreshCcw className="h-4 w-4" />
        )}
      </Button>
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
        {messages.length > 0 ? (
          messages.map((message, index) => (
            <MessageCard
              key={String(message._id)}
              message={message}
              onMessageDelete={handleDeleteMessage}
            />
          ))
        ) : (
          <p>No messages to display.</p>
        )}
      </div>
    </div>
  )
}

export default Dashboard
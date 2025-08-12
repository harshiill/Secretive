/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'
import React from 'react'
import { X } from 'lucide-react';
import dayjs from 'dayjs';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from './ui/button'
import { Message } from '@/models/user.model';
import { toast } from 'sonner';
import axios, { AxiosError } from 'axios';
import { ApiResponse } from '@/types/ApiResponse';


type MessageCardProps={
    message: Message;
    onMessageDelete : (messageId : string) => void;
}
function MessageCard({message,onMessageDelete}: MessageCardProps) {
    const handleDeleteConfirm = async () => {
       try {
        const res=await axios.delete<ApiResponse>(`/api/delete-message/${message._id}`)
        toast.success(res.data.message)
     
     if (typeof message._id === "string") {
       onMessageDelete(message._id);
     } else {
       toast.error("Invalid message id");
     }
       } catch (error) {
const axiosError = error as AxiosError<ApiResponse>;
toast.error(axiosError.response?.data.message || "Failed to delete message")

       }

    }


  return (
    <>
    <Card>
  <CardHeader>
    <div className="flex justify-between items-center"></div>
    <CardTitle>{message.content}</CardTitle>
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive"><X className="w-5 h-5" /></Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete
                  this message.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleDeleteConfirm}>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
    
  </CardHeader>
  <CardContent>
  </CardContent>
</Card>
    </>
  )
}

export default MessageCard;
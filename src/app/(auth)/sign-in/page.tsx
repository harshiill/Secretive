'use client'
import {z} from 'zod'
import {useForm} from 'react-hook-form'
import {zodResolver} from '@hookform/resolvers/zod'
import { Link } from '@react-email/components'
import axios from 'axios'
import { useState } from 'react'
import { useDebounceValue } from 'usehooks-ts'

function page() {
  const [username, setUsername] = useState('')
  const [usernameMessage, setUsernameMessage] = useState('')
  const [isCheckingUsername, setCheckingUsername] = useState(false)
  const [isSubmitting, setSubmitting] = useState(false)
  return (
    <div></div>
  )
}

export default page
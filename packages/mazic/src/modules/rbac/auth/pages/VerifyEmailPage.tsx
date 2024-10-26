import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import { Terminal } from 'lucide-react'
import { toast } from 'sonner'

import { AceDivide, Button, ButtonLink } from '@mazic/ui'

import Logo from '@mazic/components/Logo/Logo'
import { pathRoutes } from '@mazic/config/pathRoutes'

import { authService } from '../services/authService'

const VerifyEmailPage = () => {
  const email = useLocation()?.state?.email

  const [isSending, setIsSending] = useState(false)
  const [countdown, setCountdown] = useState(0)

  const resendEmailMutation = useMutation({
    mutationFn: () => authService.resendEmail(email),
    onSuccess: () => {
      setIsSending(true)
      setCountdown(120)
      toast.success('Email has been sent.')
    },
    onError: () => {
      setIsSending(true)
      setCountdown(120)
      toast.success('Email has been sent.')
    },
  })

  useEffect(() => {
    let timer: NodeJS.Timeout
    if (countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prevCountdown) => prevCountdown - 1)
      }, 1000)
    } else {
      setIsSending(false)
    }
    return () => clearInterval(timer)
  }, [countdown])

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-white dark:bg-black">
      <div className="max-w-md w-full mx-auto rounded-none md:rounded-2xl p-4 md:p-8 shadow-input">
        <Logo hideText />
        <AceDivide />
        <h2 className="font-bold text-xl text-neutral-800 dark:text-neutral-200">
          Please verify your email
        </h2>
        <p className="text-neutral-600 text-sm max-w-sm mt-8 dark:text-neutral-300">
          You're almost there! We have sent an email to
        </p>
        <p className="flex gap-2 items-center">
          <Terminal className="h-4 w-4" />
          <span>{email}</span>
        </p>
        <div className="mt-8 flex gap-2">
          <ButtonLink href={pathRoutes.auth.login} variant="outline" className="w-full">
            Sign in
          </ButtonLink>
          <Button
            className="w-full"
            onClick={() => resendEmailMutation.mutate()}
            disabled={isSending}
          >
            {isSending ? `Resend email (${countdown}s)` : 'Resend email'}
          </Button>
        </div>
      </div>
    </div>
  )
}

export default VerifyEmailPage

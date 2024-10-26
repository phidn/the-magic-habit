import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import { Terminal } from 'lucide-react'
import { toast } from 'sonner'

import { AceDivide, ButtonLink, Spinner } from '@mazic/ui'

import Logo from '@mazic/components/Logo/Logo'
import { pathRoutes } from '@mazic/config/pathRoutes'

import { authService } from '../services/authService'

const VerifyCodePage = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const code = searchParams.get('code')

  const [isVerified, setIsVerified] = useState<boolean | undefined>(undefined)
  const [email, setEmail] = useState('')

  const verifyCodeMutation = useMutation({
    mutationFn: (_code: string) => authService.verifyCode<{ email: string }>(_code),
    onSuccess: ({ data }) => {
      toast.success('Email has been verified.')
      setIsVerified(true)
      setEmail(data.data.email)
    },
    onError: () => {
      toast.error('Invalid verification code.')
      navigate(pathRoutes.auth.login)
    },
  })

  useEffect(() => {
    if (code) {
      verifyCodeMutation.mutate(code)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [code])

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-white dark:bg-black">
      <div className="max-w-md w-full mx-auto rounded-none md:rounded-2xl p-4 md:p-8 shadow-input">
        <Logo hideText />
        <AceDivide />
        <h2 className="font-bold text-xl text-neutral-800 dark:text-neutral-200">
          {isVerified === undefined && 'Verifying email'}
          {isVerified === false && 'Email verification failed'}
          {isVerified && 'Your email has been verified'}
        </h2>
        <p className="text-neutral-600 text-sm max-w-sm mt-8 dark:text-neutral-300">
          {isVerified && `You can now login with your email`}
        </p>
        <p className="flex gap-2 items-center">
          {verifyCodeMutation.isPending && <Spinner />}
          {!verifyCodeMutation.isPending && <Terminal className="h-4 w-4" />}
          <span>{email}</span>
        </p>
        <div className="mt-8 flex gap-2">
          <ButtonLink href={pathRoutes.auth.login}>Return to login</ButtonLink>
        </div>
      </div>
    </div>
  )
}

export default VerifyCodePage

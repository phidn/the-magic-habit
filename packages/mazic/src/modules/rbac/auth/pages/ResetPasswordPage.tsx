import { useEffect, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'

import {
  AceDivide,
  Alert,
  AlertDescription,
  Button,
  ExclamationTriangleIcon,
  FormMessage,
  Input,
} from '@mazic/ui'

import Logo from '@mazic/components/Logo/Logo'
import { pathRoutes } from '@mazic/config/pathRoutes'

import { LabelInputContainer } from '../components/LabelInputContainer'
import { resetPasswordSchema, TResetPassword } from '../schemas'
import { authService } from '../services/authService'

const ResetPasswordPage = () => {
  const navigate = useNavigate()

  const [searchParams] = useSearchParams()
  const code = searchParams.get('code') || ''

  const methods = useForm<TResetPassword>({
    resolver: zodResolver(resetPasswordSchema),
  })
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = methods

  const verifyCodeMutation = useMutation({
    mutationFn: (_code: string) => authService.verifyForgotCode<{ email: string }>(_code),
    onSuccess: () => {
      methods.setValue('code', code)
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

  const resetPasswordMutation = useMutation({
    mutationFn: (payload: TResetPassword) => authService.resetPassword(payload),
    onSuccess: () => {
      toast.success('Password has been reset.')
      navigate(pathRoutes.auth.login)
    },
    onError: () => {
      setError('root', {
        type: 'manual',
        message: 'Something went wrong. Please try again.',
      })
    },
  })

  const onSubmit = handleSubmit(async (values) => {
    await resetPasswordMutation.mutateAsync(values)
  })

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-white dark:bg-black">
      <div className="max-w-md w-full mx-auto rounded-none md:rounded-2xl p-4 md:p-8 shadow-input">
        <Logo hideText />
        <AceDivide />
        <h2 className="font-bold text-xl text-neutral-800 dark:text-neutral-200">
          Reset your password
        </h2>
        <p className="text-neutral-600 text-sm max-w-sm mt-2 dark:text-neutral-300">
          Strong passwords include numbers, letters, and punctuation marks. Enter your new password
        </p>
        <FormProvider {...methods}>
          <form className="my-8" onSubmit={onSubmit} autoComplete="false">
            {errors.root && (
              <Alert variant="destructive" className="mb-4">
                <ExclamationTriangleIcon className="h-4 w-4" />
                <AlertDescription>{errors.root.message}</AlertDescription>
              </Alert>
            )}
            <LabelInputContainer className="mb-4">
              <Input
                id="password"
                placeholder="••••••••"
                type="password"
                autoComplete="new-password"
                {...register('password')}
              />
              {errors.password && <FormMessage>{errors.password.message}</FormMessage>}
            </LabelInputContainer>
            <Button className="w-full mt-4" type="submit">
              Reset Password
            </Button>
          </form>
        </FormProvider>
        <div className="mt-4 text-center text-sm">
          Already have an account{' '}
          <Link to={pathRoutes.auth.login} className="underline">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  )
}

export default ResetPasswordPage

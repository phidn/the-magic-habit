import { FormProvider, useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'
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
import { authService } from '@mazic/services/authService'

import { LabelInputContainer } from './components/LabelInputContainer'
import { forgotPasswordSchema, TForgotPassword } from './schemas'

const ForgotPasswordPage = () => {
  const methods = useForm<TForgotPassword>({
    resolver: zodResolver(forgotPasswordSchema),
  })
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = methods

  const forgotPasswordMutation = useMutation({
    mutationFn: (_email: string) => authService.forgotPassword(_email),
    onSuccess: () => {
      toast.success('Email has been sent.')
    },
    onError: () => {
      setError('root', {
        type: 'manual',
        message: 'Something went wrong. Please try again.',
      })
    },
  })

  const onSubmit = handleSubmit(async (values) => {
    await forgotPasswordMutation.mutateAsync(values.email)
  })

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-white dark:bg-black">
      <div className="max-w-md w-full mx-auto rounded-none md:rounded-2xl p-4 md:p-8 shadow-input">
        <Logo hideText />
        <AceDivide />
        <h2 className="font-bold text-xl text-neutral-800 dark:text-neutral-200">
          Forgot your password?
        </h2>
        <p className="text-neutral-600 text-sm max-w-sm mt-2 dark:text-neutral-300">
          No worries, we got you. Enter your email and we will send you a link to reset your
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
              <Input id="email" placeholder="email@mazic.com" type="email" {...register('email')} />
              {errors.email && <FormMessage>{errors.email.message}</FormMessage>}
            </LabelInputContainer>
            <Button className="w-full mt-4" type="submit">
              Send Reset Link
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

export default ForgotPasswordPage

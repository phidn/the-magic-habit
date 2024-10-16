import { FormProvider, useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'

import {
  AceDivide,
  Alert,
  AlertDescription,
  ExclamationTriangleIcon,
  FormMessage,
  Input,
  Label,
} from '@mazic/ui'

import Logo from '@mazic/components/Logo/Logo'
import { pathRoutes } from '@mazic/config/pathRoutes'
import { authService } from '@mazic/services/authService'
import { useStore } from '@mazic/store/useStore'
import { ApiResponse } from '@mazic/types'
import { AuthResponse } from '@mazic/types/response'

import { BottomGradient } from './components/BottomGradient'
import { LabelInputContainer } from './components/LabelInputContainer'
import { loginSchema, TLogin } from './schemas'

const LoginPage = () => {
  const navigate = useNavigate()
  const setCurrentUser = useStore((store) => store.setCurrentUser)

  const methods = useForm<TLogin>({
    resolver: zodResolver(loginSchema),
  })
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = methods

  const loginMutation = useMutation({
    mutationFn: (body: TLogin) => authService.login<ApiResponse<AuthResponse>>(body),
    onSuccess: ({ data }) => {
      setCurrentUser(data.data.user)
      navigate('/')
    },
    onError: () => {
      setError('root', {
        type: 'manual',
        message: "That email/username and password combination didn't work. Try again.",
      })
    },
  })

  const onSubmit = handleSubmit(async (values) => {
    await loginMutation.mutateAsync(values)
  })

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-white dark:bg-black">
      <div className="max-w-md w-full mx-auto rounded-none md:rounded-2xl p-4 md:p-8 shadow-input">
        <Logo hideText />
        <AceDivide />
        <h2 className="font-bold text-xl text-neutral-800 dark:text-neutral-200">Welcome back</h2>
        <p className="text-neutral-600 text-sm max-w-sm mt-2 dark:text-neutral-300">
          Glad to see you again. Again!
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
              <Label htmlFor="email">Email</Label>
              <Input id="email" placeholder="email@mazic.com" type="email" {...register('email')} />
              {errors.email && <FormMessage>{errors.email.message}</FormMessage>}
            </LabelInputContainer>
            <LabelInputContainer className="mb-4">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                placeholder="••••••••"
                type="password"
                autoComplete="new-password"
                {...register('password')}
              />
              {errors.password && <FormMessage>{errors.password.message}</FormMessage>}
            </LabelInputContainer>
            <button
              className="bg-gradient-to-br relative group/btn from-black dark:from-zinc-900 dark:to-zinc-900 to-neutral-600 block dark:bg-zinc-800 w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]"
              type="submit"
            >
              Login in &rarr;
              <BottomGradient />
            </button>
          </form>
        </FormProvider>
        <div className="mt-4 text-center text-sm">
          Don't have an account?{' '}
          <Link to={pathRoutes.auth.signUp} className="underline">
            Sign up
          </Link>
        </div>
      </div>
    </div>
  )
}

export default LoginPage

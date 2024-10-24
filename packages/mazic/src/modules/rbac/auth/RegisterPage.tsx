import { FormProvider, useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
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
  Label,
} from '@mazic/ui'

import Logo from '@mazic/components/Logo/Logo'
import { pathRoutes } from '@mazic/config/pathRoutes'
import { authService } from '@mazic/services/authService'
import { useStore } from '@mazic/store/useStore'
import { ApiResponse } from '@mazic/types'
import { AuthResponse } from '@mazic/types/response'

import { LabelInputContainer } from './components/LabelInputContainer'
import { registerSchema, TRegister } from './schemas'

const RegisterPage = () => {
  const navigate = useNavigate()
  const setCurrentUser = useStore((store) => store.setCurrentUser)

  const methods = useForm<TRegister>({
    resolver: zodResolver(registerSchema),
  })
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = methods

  const registerMutation = useMutation({
    mutationFn: (body: TRegister) => authService.register<ApiResponse<AuthResponse>>(body),
    onSuccess: ({ data }) => {
      toast.success('Your account has been created successfully')
      setCurrentUser(data.data.user)
      navigate(pathRoutes.dashboard)
    },
    onError: (error) => {
      setError('root', {
        type: 'manual',
        message:
          error.name === 'ConflictError' ? 'Email already exists' : 'Failed to create account',
      })
    },
  })

  const onSubmit = handleSubmit(async (values) => {
    await registerMutation.mutateAsync(values)
  })

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-white dark:bg-black">
      <div className="max-w-md w-full mx-auto rounded-none md:rounded-2xl p-4 md:p-8 shadow-input">
        <Logo hideText />
        <AceDivide />
        <h2 className="font-bold text-xl text-neutral-800 dark:text-neutral-200">Sign Up</h2>
        <p className="text-neutral-600 text-sm max-w-sm mt-2 dark:text-neutral-300">
          Enter your information to create an account
        </p>
        <FormProvider {...methods}>
          <form className="my-8" onSubmit={onSubmit} autoComplete="false">
            {errors.root && (
              <Alert variant="destructive" className="mb-4">
                <ExclamationTriangleIcon className="h-4 w-4" />
                <AlertDescription>{errors.root.message}</AlertDescription>
              </Alert>
            )}
            <div className="mazic-row">
              <LabelInputContainer className="mb-4 mazic-col-6">
                <Label htmlFor="first_name">
                  First name <span className="text-destructive">{' *'}</span>
                </Label>
                <Input id="first_name" placeholder="John" {...register('first_name')} />
                {errors.first_name && <FormMessage>{errors.first_name.message}</FormMessage>}
              </LabelInputContainer>
              <LabelInputContainer className="mb-4 mazic-col-6">
                <Label htmlFor="last_name">
                  Last name
                  <span className="text-destructive">{' *'}</span>
                </Label>
                <Input id="last_name" placeholder="Doe" {...register('last_name')} />
                {errors.last_name && <FormMessage>{errors.last_name.message}</FormMessage>}
              </LabelInputContainer>
            </div>
            <LabelInputContainer className="mb-4">
              <Label htmlFor="email">
                Email<span className="text-destructive">{' *'}</span>
              </Label>
              <Input id="email" placeholder="email@mazic.com" type="email" {...register('email')} />
              {errors.email && <FormMessage>{errors.email.message}</FormMessage>}
            </LabelInputContainer>
            <LabelInputContainer className="mb-4">
              <Label htmlFor="password">
                Password<span className="text-destructive">{' *'}</span>
              </Label>
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
              Sign up
            </Button>
          </form>
        </FormProvider>
        <div className="mt-4 text-center text-sm">
          Already have an account?{' '}
          <Link to={pathRoutes.auth.login} className="underline">
            Login
          </Link>
        </div>
      </div>
    </div>
  )
}

export default RegisterPage

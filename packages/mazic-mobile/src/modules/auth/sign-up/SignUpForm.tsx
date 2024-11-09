import React, { useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { Button, HelperText } from 'react-native-paper'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigation } from '@react-navigation/native'
import { useMutation } from '@tanstack/react-query'

import { FormInput } from '@/components/FormControl/FormInput'
import { screens } from '@/config/config'
import { themeSpacing } from '@/config/theme'
import { useStore } from '@/store/useStore'
import { TNavigationRoot } from '@/types/navigation'
import http from '@/utils/http'
import { languageKeys } from '@/utils/language'

import { signUpSchema, TSignUp } from './utils'

const id = Math.random().toString(36).substring(5)

export const SignUpForm = () => {
  const { t } = useTranslation()
  const navigation = useNavigation<TNavigationRoot>()
  const setCurrentUser = useStore((state) => state.setCurrentUser)
  const [isShowPassword, setIsShowPassword] = useState(false)

  const initForm = __DEV__
    ? {
        first_name: 'devtest',
        last_name: 'devtest',
        email: `devtest-${id}@gmail.com`,
        password: 'devtest123456',
      }
    : {
        first_name: '',
        last_name: '',
        email: '',
        password: '',
      }

  const methods = useForm<TSignUp>({
    resolver: zodResolver(signUpSchema),
    values: initForm,
  })

  const loginMutation = useMutation({
    mutationFn: (body: TSignUp) => http.post('/auth/register', body),
    onSuccess: ({ data }) => {
      setCurrentUser(data.data.user)
      navigation.navigate(screens.BottomTabNavigator)
    },
    onError: (error) => {
      methods.setError('root', {
        type: 'manual',
        message:
          error.name === 'ConflictError' ? 'Email already exists' : 'Failed to create account',
      })
    },
  })

  const onSubmit = methods.handleSubmit(async (values) => {
    await loginMutation.mutateAsync(values)
  })

  return (
    <FormProvider {...methods}>
      <HelperText
        type="error"
        visible={!!methods.formState.errors.root}
        style={{ textAlign: 'center' }}
      >
        {methods.formState.errors.root?.message}
      </HelperText>

      <FormInput
        field="first_name"
        label={t(languageKeys['User.firstName'])}
        icon="account-details"
      />
      <FormInput
        field="last_name"
        label={t(languageKeys['User.lastName'])}
        icon="account-details"
      />
      <FormInput
        field="email"
        label={t(languageKeys['User.email'])}
        icon="email"
        keyboardType="email-address"
      />
      <FormInput
        field="password"
        label={t(languageKeys['User.password'])}
        icon="eye"
        onIconPress={() => setIsShowPassword((prev) => !prev)}
        secureTextEntry={!isShowPassword}
      />
      <Button
        icon="account-edit"
        mode="contained"
        onPress={onSubmit}
        loading={methods.formState.isSubmitting}
        style={{ marginTop: themeSpacing.xl }}
      >
        {t(languageKeys['Auth.SignUp.title'])}
      </Button>
    </FormProvider>
  )
}

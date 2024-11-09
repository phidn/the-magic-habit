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

import { loginSchema, TLogin } from './utils'

export const LoginForm = () => {
  const { t } = useTranslation()
  const navigation = useNavigation<TNavigationRoot>()
  const setCurrentUser = useStore((state) => state.setCurrentUser)
  const [isShowPassword, setIsShowPassword] = useState(false)

  const initForm = __DEV__
    ? {
        email: 'user@gmail.com',
        password: '125@125A125a',
      }
    : {
        email: '',
        password: '',
      }

  const methods = useForm<TLogin>({
    resolver: zodResolver(loginSchema),
    values: initForm,
  })

  const loginMutation = useMutation({
    mutationFn: (body: TLogin) => http.post('/auth/login', body),
    onSuccess: ({ data }) => {
      setCurrentUser(data.data.user)
      navigation.navigate(screens.BottomTabNavigator)
    },
    onError: () => {
      methods.setError('root', {
        type: 'manual',
        message: t(languageKeys['Auth.Login.error.invalid']),
      })
    },
  })

  const onSubmit = methods.handleSubmit(async (values) => {
    await loginMutation.mutateAsync(values)
  })

  return (
    <FormProvider {...methods}>
      <HelperText type="error" visible={!!methods.formState.errors.root} style={{ textAlign: 'center' }}>
        {methods.formState.errors.root?.message}
      </HelperText>

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
        icon="login"
        mode="contained"
        onPress={onSubmit}
        loading={methods.formState.isSubmitting}
        style={{ marginTop: themeSpacing.xl }}
      >
        {t(languageKeys['Auth.Login.title'])}
      </Button>
    </FormProvider>
  )
}

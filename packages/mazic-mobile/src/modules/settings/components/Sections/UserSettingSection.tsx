import React from 'react'
import { useTranslation } from 'react-i18next'
import { Card, List } from 'react-native-paper'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { useNavigation } from '@react-navigation/native'

import { screens } from '@/config/config'
import { TNavigationRoot } from '@/types/navigation'
import { clearStorage } from '@/utils/asyncStorage'
import { languageKeys } from '@/utils/language'

import { CardTitle } from '../CardTitle/CardTitle'

export const UserSettingSection = () => {
  const { t } = useTranslation()
  const navigation = useNavigation<TNavigationRoot>()

  const onLogout = async () => {
    await clearStorage()
    navigation.navigate(screens.LoginScreen)
  }

  return (
    <>
      <CardTitle title={t(languageKeys['Settings.user'])} />
      <Card style={{ marginBottom: 20 }}>
        <List.Item
          title={t(languageKeys['Settings.user.logout'])}
          left={(props) => <MaterialCommunityIcons {...props} name="logout-variant" size={24} />}
          right={() => <List.Icon icon="chevron-right" />}
          onPress={onLogout}
        />
      </Card>
    </>
  )
}

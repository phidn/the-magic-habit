import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Linking } from 'react-native'
import DeviceInfo from 'react-native-device-info'
import { Card, List, Switch } from 'react-native-paper'
import Entypo from 'react-native-vector-icons/Entypo'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import { useNavigation } from '@react-navigation/native'

import PageContainer from '@/components/Containers/PageContainer'
import RowContainer from '@/components/Containers/RowContainer'
import ColorPickerModal from '@/components/Modals/ColorPickerModal/ColorPickerModal'
import { privacyPolicyLink, screens, termsAndConditionsLink } from '@/config/config'
import { themeSpacing } from '@/config/theme'
import { useStore } from '@/store/useStore'
import { TNavigationRoot } from '@/types/navigation'
import { availableLanguages, getLanguageName, languageKeys } from '@/utils/language'
import RateHelper, { AndroidMarket } from '@/utils/rate'

import { CardTitle } from '../components/CardTitle/CardTitle'
import { ListColor } from '../components/ListColor/ListColor'
import { UserSettingSection } from '../components/Sections/UserSettingSection'

const PAGE_PADDING_HORIZONTAL = 10

export const SettingsScreen = () => {
  const navigation = useNavigation<TNavigationRoot>()

  const { t, i18n } = useTranslation()

  const isDarkMode = useStore((state) => state.isDarkMode)
  const toggleMode = useStore((state) => state.toggleMode)
  const language = availableLanguages.find((x) => x.code === i18n.resolvedLanguage)

  const [isShowPicker, setIsShowPicker] = useState(false)

  const feedbackHandler = async () => {
    const subject = `[${DeviceInfo.getApplicationName()}] ${t('Settings.moreSetting.feedback')}`

    const message = `
      - Version: ${DeviceInfo.getVersion()}
      - OS API: ${await DeviceInfo.getApiLevel()}
      - Language: ${getLanguageName(i18n.resolvedLanguage)}
      - Device: ${await DeviceInfo.getDevice()} | ${await DeviceInfo.getDeviceName()}
    `

    const _break = '%0D%0A'
    const _message = message.replace(/ {6}- /g, '').trim() + _break + _break + _break

    Linking.openURL(`mailto:hello.dangnhatphi@gmail.com?subject=${subject}&body=${_message}`).catch(
      (err) => console.error('ERROR > cannot open send email', err),
    )
  }

  const rateApp = () => {
    const options = {
      GooglePackageName: 'com.phidang.mindfulcheckin',
      preferredAndroidMarket: AndroidMarket.Google,
      preferInApp: false,
      openAppStoreIfInAppFails: true,
    }
    RateHelper.rate(options, () => {})
  }

  return (
    <PageContainer
      isScroll={true}
      style={{ paddingHorizontal: PAGE_PADDING_HORIZONTAL, marginTop: 20 }}
      appbar={{ title: t(languageKeys['Navigation.BottomTab.SettingsTab']) }}
    >
      <UserSettingSection />
      <CardTitle title={t(languageKeys['Settings.appearance'])} />
      <Card style={[{ marginBottom: themeSpacing.lg }, { paddingBottom: 20 }]}>
        <List.Item
          title={t(languageKeys['Settings.language'])}
          description={language?.name ? language.name : ''}
          left={(props) => <Entypo {...props} name="language" size={24} />}
          right={() => <List.Icon icon="chevron-right" />}
          onPress={() => navigation.navigate(screens.LanguageSettingScreen)}
        />
        <List.Item
          title={t(languageKeys['Settings.colorMode'])}
          description={
            isDarkMode
              ? t(languageKeys['Settings.colorMode.dark'])
              : t(languageKeys['Settings.colorMode.light'])
          }
          left={(props) => (
            <MaterialCommunityIcons {...props} name={'theme-light-dark'} size={24} />
          )}
          right={() => <Switch value={isDarkMode} onValueChange={toggleMode} />}
        />
        <List.Item
          title={t(languageKeys['Settings.themeColors'])}
          left={(props) => <MaterialCommunityIcons {...props} name="format-color-fill" size={24} />}
        />
        <RowContainer style={{ justifyContent: 'flex-start', marginLeft: 50 }}>
          <ListColor
            togglePicker={() => setIsShowPicker(true)}
            gap={85 + PAGE_PADDING_HORIZONTAL * 2}
            range={[0, 9]}
          />
        </RowContainer>
      </Card>
      <CardTitle title={t(languageKeys['Settings.support'])} />
      <Card style={{ marginBottom: themeSpacing.md }}>
        <List.Item
          title={t(languageKeys['Settings.moreSetting.feedback'])}
          left={(props) => (
            <MaterialCommunityIcons {...props} name="email-edit-outline" size={24} />
          )}
          right={() => <List.Icon icon="chevron-right" />}
          onPress={feedbackHandler}
        />
        <List.Item
          title={t(languageKeys['Settings.moreSetting.rateApp'])}
          left={(props) => <MaterialIcons {...props} name="star-outline" size={24} />}
          onPress={rateApp}
        />
      </Card>
      <CardTitle title={t(languageKeys['Settings.moreSetting'])} />
      <Card style={{ marginBottom: themeSpacing.md }}>
        <List.Item
          title={t(languageKeys['Settings.moreSetting.privacyPolicy'])}
          left={(props) => (
            <MaterialCommunityIcons {...props} name="file-document-outline" size={24} />
          )}
          right={() => <List.Icon icon="chevron-right" />}
          onPress={() => Linking.openURL(privacyPolicyLink)}
        />
        <List.Item
          title={t(languageKeys['Settings.moreSetting.terms'])}
          left={(props) => (
            <MaterialCommunityIcons {...props} name="file-document-outline" size={24} />
          )}
          right={() => <List.Icon icon="chevron-right" />}
          onPress={() => Linking.openURL(termsAndConditionsLink)}
        />
      </Card>
      {isShowPicker && <ColorPickerModal onClose={() => setIsShowPicker(false)} />}
    </PageContainer>
  )
}

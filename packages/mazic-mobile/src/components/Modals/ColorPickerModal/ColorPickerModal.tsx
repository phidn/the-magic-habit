import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View } from 'react-native'
import { Button, Modal, Portal, useTheme } from 'react-native-paper'

import { useStore } from '@/store/useStore'
import { languageKeys } from '@/utils/language'

import ColorPicker from './ColorPicker'

interface IProps {
  isShowSoundDialog: boolean
  setIsShowSoundDialog: (isShow: boolean) => void
}

const ColorPickerModal = ({ isShowSoundDialog, setIsShowSoundDialog }: IProps) => {
  const { t } = useTranslation()
  const { colors } = useTheme()

  const [bg, setBg] = useState<string>('#000000')
  const setThemeColor = useStore((state) => state.setThemeColor)
  const setCustomColor = useStore((state) => state.setCustomColor)

  const changeThemeColor = () => {
    setIsShowSoundDialog(false)
    setThemeColor(bg)
    setCustomColor(bg)
  }

  return (
    <Portal>
      <Modal
        visible={isShowSoundDialog}
        onDismiss={() => setIsShowSoundDialog(!isShowSoundDialog)}
        contentContainerStyle={{
          backgroundColor: colors.elevation.level3,
          padding: 20,
          margin: 20,
          height: '60%',
        }}
      >
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: bg,
          }}
        >
          <ColorPicker
            styles={{
              width: 200,
              height: 15,
              borderRadius: 20,
              borderWidth: 1,
              borderColor: '#fff',
            }}
            onColorChanged={(color: string) => setBg(color)}
          />
        </View>
        <View style={styles.modalActions}>
          <Button onPress={() => setIsShowSoundDialog(!isShowSoundDialog)}>
            {t(languageKeys['common.cancel'])}
          </Button>
          <Button onPress={changeThemeColor}>Ok</Button>
        </View>
      </Modal>
    </Portal>
  )
}

export default ColorPickerModal

const styles = StyleSheet.create({
  modalScrollView: {
    borderTopWidth: 1,
    borderBottomWidth: 1,
    marginVertical: 10,
  },
  modalActions: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: -10,
    marginTop: 20,
  },
})

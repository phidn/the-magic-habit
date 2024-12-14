import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View } from 'react-native'
import { Button, Modal, Portal, useTheme } from 'react-native-paper'

import { useStoreShallow } from '@/store/useStore'
import { languageKeys } from '@/utils/language'

import ColorPicker from './ColorPicker'

interface IProps {
  onClose: () => void
}

const ColorPickerModal = ({ onClose }: IProps) => {
  const { t } = useTranslation()
  const { colors } = useTheme()

  const [bg, setBg] = useState<string>('#000000')
  const [setThemeColor, setCustomColor] = useStoreShallow((state) => [
    state.setThemeColor,
    state.setCustomColor,
  ])

  const changeThemeColor = () => {
    setThemeColor(bg)
    setCustomColor(bg)
    onClose?.()
  }

  return (
    <Portal>
      <Modal
        visible={true}
        onDismiss={onClose}
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
          <Button onPress={onClose}>{t(languageKeys['common.cancel'])}</Button>
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

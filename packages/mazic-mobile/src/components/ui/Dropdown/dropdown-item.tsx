import { useMemo } from 'react'
import { View } from 'react-native'
import { Divider, Icon, Menu, Text, useTheme } from 'react-native-paper'

import { DropdownItemProps } from './types'

function DropdownItem(props: DropdownItemProps) {
  const { option, width, value, onSelect, toggleMenu, isLast, menuItemTestID } = props
  const style = useMemo(() => ({ minWidth: width }), [width])
  const theme = useTheme()
  const titleStyle = useMemo(
    () => ({
      color: value === option.value ? theme.colors.primary : theme.colors.onBackground,
      width: width,
    }),
    [option.value, theme.colors.onBackground, theme.colors.primary, value, width],
  )
  const onPress = () => {
    if (option.value) {
      onSelect?.(option.value)
    }
    toggleMenu()
  }

  return (
    <>
      <Menu.Item
        style={style}
        title={
          <View
            style={{
              height: '100%',
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              width: option.dropdownIcon ? '80%' : '90%',
            }}
          >
            <Text>{option.label}</Text>
            <Icon
              size={20}
              source="check"
              color={value === option.value ? theme.colors.primary : 'transparent'}
            />
          </View>
        }
        titleStyle={titleStyle}
        contentStyle={style}
        onPress={onPress}
        testID={menuItemTestID}
        leadingIcon={option.dropdownIcon ? () => option.dropdownIcon : undefined}
      />
      {!isLast && <Divider />}
    </>
  )
}

export default DropdownItem

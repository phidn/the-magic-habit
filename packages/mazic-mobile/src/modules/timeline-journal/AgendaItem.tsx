import React from 'react'
import { StyleSheet, TouchableOpacity, View } from 'react-native'
import { Chip, Text, useTheme } from 'react-native-paper'
import isEmpty from 'lodash/isEmpty'

interface ItemProps {
  item: any
}

const AgendaItem = (props: ItemProps) => {
  const { item } = props
  const { colors } = useTheme()

  if (isEmpty(item)) {
    return (
      <View
        style={[
          styles.emptyItem,
          {
            backgroundColor: colors.background,
          },
        ]}
      >
        <Text style={styles.emptyItemText}>No journal entry</Text>
      </View>
    )
  }

  return (
    <TouchableOpacity
      style={[
        styles.item,
        {
          backgroundColor: colors.background,
        },
      ]}
    >
      <Text style={[styles.itemTitleText, { color: colors.onBackground }]}>{item.title}</Text>
      {item?.habitName && (
        <View style={styles.itemButtonContainer}>
          <Chip>{item?.habitName}</Chip>
        </View>
      )}
    </TouchableOpacity>
  )
}

export default React.memo(AgendaItem)

const styles = StyleSheet.create({
  item: {
    padding: 20,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: 'lightgrey',
    flexDirection: 'row',
    flex: 1,
  },
  itemTitleText: {
    marginLeft: 16,
    fontWeight: 'bold',
    fontSize: 16,
    flex: 1,
  },
  itemButtonContainer: {
    alignItems: 'flex-end',
  },
  emptyItem: {
    paddingLeft: 20,
    height: 52,
    justifyContent: 'center',
    borderBottomWidth: 1,
    borderBottomColor: 'lightgrey',
  },
  emptyItemText: {
    color: 'lightgrey',
    fontSize: 14,
  },
})

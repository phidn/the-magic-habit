import React, { forwardRef } from 'react'
import { useTheme } from 'react-native-paper'
import { BottomSheetBackdrop, BottomSheetModal, BottomSheetView, useBottomSheetModal } from '@gorhom/bottom-sheet'
import dayjs from 'dayjs'

import { checkInSchema, checkInType, HeatMapValue, THabit, THabitCheckIn } from '@mazic/shared'

import { useCheckIn, useDeleteCheckIn } from '../apis'

import { CheckInForm } from './CheckInForm'

interface IProps {
  habit: THabit
  activityDate: dayjs.Dayjs
  checkInData?: HeatMapValue
  refetch?: () => void
}

export const CheckInModal = forwardRef<BottomSheetModal, IProps>((props, ref) => {
  const { habit, checkInData, activityDate, refetch } = props

  const checkInMutation = useCheckIn()
  const deleteCheckIn = useDeleteCheckIn()
  const { dismiss } = useBottomSheetModal()

  const { colors } = useTheme()

  const isNumberCheckIn = habit?.check_in_type === checkInType.INPUT_NUMBER
  const isEdit = !!checkInData?.id

  const onSubmitForm = (values: THabitCheckIn) => {
    checkInMutation.mutateAsync(values, {
      onSuccess: () => refetch?.() && dismiss(),
    })
  }

  const onDeleteForm = () => {
    deleteCheckIn.mutate(checkInData?.id as string, {
      onSuccess: () => refetch?.() && dismiss(),
    })
  }

  return (
    <BottomSheetModal
      ref={ref}
      index={2}
      snapPoints={['25%', '55%', '70%', '90%']}
      backdropComponent={BottomSheetBackdrop}
      handleStyle={{ backgroundColor: colors.surface, marginBottom: -12 }}
    >
      <BottomSheetView>
        <CheckInForm
          habit={habit}
          title={`Check-in (${habit?.title})`}
          initialValues={{
            id: checkInData?.id,
            habit_id: habit.id as string,
            date: activityDate.toDate(),
            journal: checkInData?.journal || '',
            value: isNumberCheckIn ? String(isEdit ? checkInData?.count : '') : undefined,
            is_done: isNumberCheckIn ? undefined : true,
          }}
          schema={checkInSchema}
          onSubmitForm={onSubmitForm}
          onDeleteForm={checkInData?.id ? onDeleteForm : undefined}
        />
      </BottomSheetView>
    </BottomSheetModal>
  )
})

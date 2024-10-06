import { FormProvider, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import capitalize from 'lodash/capitalize'
import isEqual from 'lodash/isEqual'

import { Button, Card, CardContent, cn } from '@mazic/ui'

import { FormDatePicker, FormInput, FormItem } from '@mazic/components'
import { THabit } from '@mazic/modules/habit'

import { checkInSchema, THabitCheckIn } from '../../utils/validations'

interface Props {
  habit: THabit
  checkInEntry: THabitCheckIn
  onSubmitForm: (data: THabitCheckIn) => Promise<void>
  onDeleteForm: (id: string) => void
  isNumberCheckIn: boolean
}

export const FormCheckIn = (props: Props) => {
  const { habit, checkInEntry, onSubmitForm, onDeleteForm, isNumberCheckIn } = props
  const methods = useForm<THabitCheckIn>({
    resolver: zodResolver(checkInSchema),
    values: checkInEntry,
  })

  const isSave = !isEqual(checkInEntry, methods.watch()) || !isNumberCheckIn

  // console.log('values', methods.watch())
  // console.log('errors', methods.formState.errors)

  const onSubmit = methods.handleSubmit(async (data) => onSubmitForm(data))

  const isNewEntry = !checkInEntry.id

  return (
    <FormProvider {...methods}>
      <form onSubmit={onSubmit}>
        <div className="mazic-row">
          <div className="mazic-col-12">
            <Card className={cn('mb-2 pt-6')}>
              <CardContent>
                <FormItem label="Date" required col={12}>
                  <FormDatePicker field="date" disabled />
                </FormItem>
                {isNumberCheckIn && (
                  <FormItem label={capitalize(habit.metric || '')} required col={12}>
                    <FormInput type="number" field="value" placeholder="Enter value.." />
                  </FormItem>
                )}
                <FormItem label="Journal" col={12}>
                  <FormInput field="journal" placeholder="Enter journal.." />
                </FormItem>
              </CardContent>
            </Card>
          </div>
        </div>
        <div className="mazic-row justify-end gap-2 mt-4">
          {!isNewEntry && (
            <Button
              type="button"
              variant="destructive"
              onClick={() => onDeleteForm(checkInEntry.id as string)}
            >
              Delete
            </Button>
          )}
          <Button disabled={!isSave}>{isNumberCheckIn ? 'Save' : 'Complete'}</Button>
        </div>
      </form>
    </FormProvider>
  )
}

import { FormProvider, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import capitalize from 'lodash/capitalize'

import { Button, Card, CardContent } from '@mazic-design-system'

import { FormDatePicker, FormInput, FormItem } from '@mazic/components'
import { habitCheckInSchema, THabit, THabitCheckIn } from '@mazic/modules/habit/validations'
import { cn } from '@mazic/utils/cn'

interface Props {
  habit: THabit
  checkInEntry: THabitCheckIn
  onSubmitForm: (data: THabitCheckIn) => Promise<void>
}

export const FormCheckIn = ({ habit, checkInEntry, onSubmitForm }: Props) => {
  const methods = useForm<THabitCheckIn>({
    resolver: zodResolver(habitCheckInSchema),
    values: checkInEntry,
  })

  // console.log('values', methods.watch())
  // console.log('errors', methods.formState.errors)

  const onSubmit = methods.handleSubmit(async (data) => onSubmitForm(data))

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
                <FormItem label={capitalize(habit.metric)} required col={12}>
                  <FormInput type="number" field="value" placeholder="Enter value.." />
                </FormItem>
                <FormItem label="Journal" col={12}>
                  <FormInput field="journal" placeholder="Enter journal.." />
                </FormItem>
              </CardContent>
            </Card>
          </div>
        </div>
        <div className="mazic-row justify-end gap-2 mt-4">
          <Button>Save</Button>
        </div>
      </form>
    </FormProvider>
  )
}

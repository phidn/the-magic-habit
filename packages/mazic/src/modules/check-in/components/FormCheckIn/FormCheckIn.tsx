import { FormProvider, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import capitalize from 'lodash/capitalize'
import isEqual from 'lodash/isEqual'

import { Button, Card, CardContent, CircleProgress, cn } from '@mazic/ui'
import { checkInSchema, checkInType, TCriterion, THabit, THabitCheckIn } from '@mazic/shared'
import { FormDatePicker, FormEditor, FormInput, FormItem, FormTextarea } from '@mazic/components'

interface Props {
  habit: THabit
  checkInEntry: THabitCheckIn
  onSubmitForm: (data: THabitCheckIn) => Promise<void>
  onDeleteForm: (id: string) => void
}

export const FormCheckIn = (props: Props) => {
  const { habit, checkInEntry, onSubmitForm, onDeleteForm } = props

  const methods = useForm<THabitCheckIn>({
    resolver: zodResolver(checkInSchema),
    values: checkInEntry,
  })

  // console.log('values', methods.watch())
  // console.log('errors', methods.formState.errors)

  const isNumberCheckIn = habit.check_in_type === checkInType.INPUT_NUMBER
  const isMultiCriteriaCheckIn = habit.check_in_type === checkInType.MULTI_CRITERIA
  const isSave = !isEqual(checkInEntry, methods.watch()) || !isNumberCheckIn
  const onSubmit = methods.handleSubmit(async (data) => onSubmitForm(data))
  const isNewEntry = !checkInEntry.id
  const isTemplateExists = !!habit.template && habit.template.length > 0

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
                {isMultiCriteriaCheckIn && (
                  <Card className="p-2 my-2">
                    {(habit.criterions || []).map((criterion: TCriterion, idx: number) => {
                      const value = Number(
                        methods.watch(`criterion_values.${idx}.value` as keyof THabitCheckIn) || 0
                      )
                      return (
                        <FormItem key={criterion.id} label={criterion.name} required col={12}>
                          <div className="flex items-center gap-2">
                            <FormInput
                              type="number"
                              field={`criterion_values.${idx}.value`}
                              placeholder={`Enter value (goal: ${criterion.goal_number})...`}
                              min={0}
                              max={criterion.goal_number}
                              afterChange={() => {
                                const sum = (methods.getValues('criterion_values') || []).reduce(
                                  (acc, curr) => acc + curr.value,
                                  0
                                )
                                methods.setValue('value', sum)
                              }}
                            />
                            <CircleProgress
                              value={value > criterion.goal_number ? criterion.goal_number : value}
                              maxValue={criterion.goal_number || 0}
                              size={40}
                              animationDuration={500}
                            />
                          </div>
                        </FormItem>
                      )
                    })}
                  </Card>
                )}
                <FormItem label="Journal" col={12}>
                  {isTemplateExists ? (
                    <FormEditor field="journal" />
                  ) : (
                    <FormTextarea
                      field="journal"
                      rows={2}
                      style={{ minHeight: 'unset' }}
                      placeholder="Enter journal..."
                    />
                  )}
                </FormItem>
              </CardContent>
            </Card>
          </div>
        </div>
        <div className="flex justify-end gap-2 mt-2">
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

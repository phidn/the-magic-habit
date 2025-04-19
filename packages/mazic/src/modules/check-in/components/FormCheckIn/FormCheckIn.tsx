import { FormProvider, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import capitalize from 'lodash/capitalize'
import isEqual from 'lodash/isEqual'

import { Button, Card, CardContent, cn } from '@mazic/ui'
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
                  <>
                    <h3 className="text-lg font-semibold mb-4">Criteria</h3>
                    {(habit.criterions || []).map((criterion: TCriterion) => (
                      <FormItem key={criterion.id} label={criterion.name} required col={12}>
                        <FormInput
                          type="number"
                          field={`criterion_values.${criterion.id}`}
                          placeholder={`Enter value (goal: ${criterion.goal_number})...`}
                          min={0}
                          max={criterion.goal_number}
                        />
                      </FormItem>
                    ))}
                  </>
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

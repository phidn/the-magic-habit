import { useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { format } from 'date-fns'
import capitalize from 'lodash/capitalize'

import { Badge, Button, Card, CardContent, CardHeader, CardTitle, CircleProgress } from '@mazic/ui'
import {
  checkInSchema,
  checkInType,
  HeatMapValue,
  TCriterion,
  THabit,
  THabitCheckIn,
} from '@mazic/shared'
import { FormInput, FormItem, FormTextarea } from '@mazic/components'
import { useCheckIn, useDeleteCheckIn } from '@mazic/modules/check-in'

interface Props {
  habit: THabit
  refetch: () => void
  onDelete: (id: string) => void
}

export const HabitCheckInCard = (props: Props) => {
  const { habit, refetch, onDelete } = props
  const [isSubmitting, setIsSubmitting] = useState(false)

  const checkIn = useCheckIn()
  const deleteCheckIn = useDeleteCheckIn()

  // Get today's entry if it exists
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const todayEntry = habit.activities?.find((activity: HeatMapValue) => {
    const entryDate = new Date(activity.date)
    entryDate.setHours(0, 0, 0, 0)
    return entryDate.getTime() === today.getTime()
  })

  // Create check-in entry for today
  const createCheckInEntry = (): THabitCheckIn => {
    const initJournal = todayEntry?.journal || ''

    const baseEntry: THabitCheckIn = {
      id: todayEntry?.id,
      habit_id: habit.id as string,
      date: today,
      journal: initJournal,
      value: undefined,
      is_done: undefined,
      criterion_values: undefined,
    }

    if (habit.check_in_type === checkInType.MULTI_CRITERIA) {
      if (!baseEntry.id) {
        baseEntry.criterion_values = (habit.criterions || []).map((criterion) => ({
          criterion_id: criterion.id as string,
          value: 0,
        }))
        baseEntry.value = 0
      } else {
        baseEntry.criterion_values = (habit.criterions || []).map((criterion) => {
          const criterionValue = (todayEntry?.criterion_values || []).find(
            (cv: any) => cv.criterion_id === criterion.id
          )
          return {
            criterion_id: criterion.id as string,
            value: criterionValue?.value || 0,
          }
        })
        baseEntry.value = todayEntry?.count || 0
      }
    } else if (habit.check_in_type === checkInType.INPUT_NUMBER) {
      baseEntry.value = todayEntry?.count || 0
    } else {
      baseEntry.is_done = todayEntry?.is_done || false
    }

    return baseEntry
  }

  const methods = useForm<THabitCheckIn>({
    resolver: zodResolver(checkInSchema),
    defaultValues: createCheckInEntry(),
  })

  const isNumberCheckIn = habit.check_in_type === checkInType.INPUT_NUMBER
  const isMultiCriteriaCheckIn = habit.check_in_type === checkInType.MULTI_CRITERIA
  const isDoneCheckIn = habit.check_in_type === checkInType.DONE
  const isDoneNoteCheckIn = habit.check_in_type === checkInType.DONE_NOTE

  const getCheckInTypeLabel = () => {
    switch (habit.check_in_type) {
      case checkInType.INPUT_NUMBER:
        return 'Number'
      case checkInType.MULTI_CRITERIA:
        return 'Multi-Criteria'
      case checkInType.DONE_NOTE:
        return 'Done + Note'
      default:
        return 'Done'
    }
  }

  const handleQuickComplete = async () => {
    if (isDoneCheckIn && !todayEntry) {
      setIsSubmitting(true)
      try {
        await checkIn.mutateAsync({
          habit_id: habit.id as string,
          date: today,
          journal: habit?.template || '',
          is_done: true,
        })
        refetch()
      } catch (error) {
        console.error('Quick complete failed:', error)
      } finally {
        setIsSubmitting(false)
      }
    }
  }

  const onSubmit = methods.handleSubmit(async (data) => {
    setIsSubmitting(true)
    try {
      await checkIn.mutateAsync(data)
      refetch()
    } catch (error) {
      console.error('Check-in failed:', error)
    } finally {
      setIsSubmitting(false)
    }
  })

  const handleDelete = async () => {
    if (todayEntry?.id) {
      try {
        await deleteCheckIn.mutateAsync(todayEntry.id)
        onDelete(todayEntry.id)
        refetch()
      } catch (error) {
        console.error('Delete failed:', error)
      }
    }
  }

  const value = Number(methods.watch('value') || 0)
  const goalNumber = Number(habit.goal_number || 0)
  const isCompleted =
    todayEntry?.is_done ||
    (isNumberCheckIn && todayEntry?.count && todayEntry.count > 0) ||
    (isMultiCriteriaCheckIn && todayEntry?.count && todayEntry.count > 0)

  return (
    <Card className={`relative ${isCompleted ? 'border-green-500 bg-green-50' : ''}`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg font-semibold" style={{ color: habit.color }}>
              {habit.title}
            </CardTitle>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant="outline" className="text-xs">
                {getCheckInTypeLabel()}
              </Badge>
              {isCompleted && (
                <Badge variant="default" className="text-xs bg-green-500">
                  ✓ Completed
                </Badge>
              )}
            </div>
          </div>
          {isCompleted && (
            <div className="flex items-center text-green-600">
              <span className="text-2xl">✓</span>
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <FormProvider {...methods}>
          <form onSubmit={onSubmit} className="space-y-3">
            <div className="text-sm text-muted-foreground mb-2">
              {format(today, 'EEEE, MMMM d, yyyy')}
            </div>

            {/* Quick complete for DONE type */}
            {isDoneCheckIn && !todayEntry && (
              <Button
                type="button"
                onClick={handleQuickComplete}
                disabled={isSubmitting}
                className="w-full"
                style={{ backgroundColor: habit.color }}
              >
                {isSubmitting ? 'Completing...' : 'Mark as Done'}
              </Button>
            )}

            {/* Number input for INPUT_NUMBER type */}
            {isNumberCheckIn && (
              <FormItem
                label={`${capitalize(habit.metric || '')} (Goal: ${goalNumber || 'No goal set'})`}
                col={12}
              >
                <div className="flex items-center gap-2">
                  <FormInput type="number" field="value" placeholder="Enter value..." min={0} />
                  {!!goalNumber && (
                    <CircleProgress
                      value={value > goalNumber ? goalNumber : value}
                      maxValue={goalNumber}
                      size={40}
                      animationDuration={500}
                    />
                  )}
                </div>
              </FormItem>
            )}

            {/* Multi-criteria inputs */}
            {isMultiCriteriaCheckIn && (
              <div className="space-y-2">
                {(habit.criterions || []).map((criterion: TCriterion, idx: number) => {
                  const criterionValue = Number(
                    methods.watch(`criterion_values.${idx}.value` as keyof THabitCheckIn) || 0
                  )
                  return (
                    <FormItem
                      key={criterion.id}
                      label={`${criterion.name} (${criterion.goal_number} points)`}
                      col={12}
                    >
                      <div className="flex items-center gap-2">
                        <FormInput
                          type="number"
                          field={`criterion_values.${idx}.value`}
                          placeholder={`0-${criterion.goal_number}`}
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
                          value={
                            criterionValue > criterion.goal_number
                              ? criterion.goal_number
                              : criterionValue
                          }
                          maxValue={criterion.goal_number || 0}
                          size={32}
                          animationDuration={500}
                        />
                      </div>
                    </FormItem>
                  )
                })}
              </div>
            )}

            {/* Journal/Note field for applicable types */}
            {(isDoneNoteCheckIn || isNumberCheckIn || isMultiCriteriaCheckIn) && (
              <FormItem label="Note" col={12}>
                <FormTextarea
                  field="journal"
                  rows={2}
                  style={{ minHeight: 'unset' }}
                  placeholder="Add a note..."
                />
              </FormItem>
            )}

            {/* Action buttons */}
            {!isDoneCheckIn && (
              <div className="flex gap-2 pt-2">
                {todayEntry && (
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={handleDelete}
                    disabled={isSubmitting}
                  >
                    Delete
                  </Button>
                )}
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1"
                  style={{ backgroundColor: habit.color }}
                >
                  {isSubmitting ? 'Saving...' : todayEntry ? 'Update' : 'Complete'}
                </Button>
              </div>
            )}

            {/* Already completed state for DONE type */}
            {isDoneCheckIn && todayEntry && (
              <div className="flex gap-2 pt-2">
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={handleDelete}
                  disabled={isSubmitting}
                >
                  Delete
                </Button>
                <div className="flex-1 text-center text-sm text-green-600 py-2">
                  Completed today!
                </div>
              </div>
            )}
          </form>
        </FormProvider>
      </CardContent>
    </Card>
  )
}

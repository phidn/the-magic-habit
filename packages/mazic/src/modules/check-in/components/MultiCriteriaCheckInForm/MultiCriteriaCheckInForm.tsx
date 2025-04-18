import { useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

import { Button, Card, CardContent } from '@mazic/ui'
import { TCriterion, THabit } from '@mazic/shared'
import { FormDatePicker, FormEditor, FormInput, FormItem, FormTextarea } from '@mazic/components'

interface MultiCriteriaFormValues {
  date: Date
  journal: string
  criteriaValues: Record<string, number>
}

const createMultiCriteriaSchema = (criteria: TCriterion[]) => {
  const criteriaFields: Record<string, z.ZodNumber> = {}

  criteria.forEach((criterion) => {
    criteriaFields[criterion.id as string] = z
      .number()
      .min(0, 'Value must be at least 0')
      .max(criterion.goal_number, `Value cannot exceed ${criterion.goal_number}`)
  })

  return z.object({
    date: z.date({
      required_error: 'Date is required',
    }),
    journal: z.string().optional().default(''),
    criteriaValues: z.object(criteriaFields),
  })
}

interface CriteriaValues {
  criterion_id: string
  value: number
}

interface BatchSubmitData {
  habit_id: string
  date: Date
  items: CriteriaValues[]
  journal: string
}

interface Props {
  habit: THabit
  criteria: TCriterion[]
  initialDate?: Date
  initialJournal?: string
  initialValues?: Record<string, number>
  onSubmitForm: (data: BatchSubmitData) => Promise<void>
}

export const MultiCriteriaCheckInForm = ({
  habit,
  criteria,
  initialDate = new Date(),
  initialJournal = '',
  initialValues = {},
  onSubmitForm,
}: Props) => {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const schema = createMultiCriteriaSchema(criteria)

  const defaultCriteriaValues: Record<string, number> = {}
  criteria.forEach((criterion) => {
    const id = criterion.id as string
    defaultCriteriaValues[id] = initialValues[id] || 0
  })

  const methods = useForm<MultiCriteriaFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      date: initialDate,
      journal: initialJournal,
      criteriaValues: defaultCriteriaValues,
    },
  })

  const handleSubmit = async (values: MultiCriteriaFormValues) => {
    setIsSubmitting(true)
    try {
      const items: CriteriaValues[] = Object.entries(values.criteriaValues).map(
        ([criterion_id, value]) => ({
          criterion_id,
          value,
        })
      )

      await onSubmitForm({
        habit_id: habit.id,
        date: values.date,
        items,
        journal: values.journal,
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const isTemplateExists = !!habit.template && habit.template.length > 0

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(handleSubmit)}>
        <div className="space-y-4">
          <Card>
            <CardContent className="pt-6">
              <FormItem label="Date" required col={12}>
                <FormDatePicker field="date" disabled />
              </FormItem>

              <div className="my-4">
                <h3 className="text-lg font-medium mb-4">Criteria Evaluation</h3>
                <div className="space-y-4">
                  {criteria.map((criterion) => (
                    <div key={criterion.id} className="grid grid-cols-12 gap-4 items-center">
                      <div className="col-span-5">
                        <p className="font-medium">{criterion.name}</p>
                      </div>
                      <div className="col-span-7">
                        <FormInput
                          type="number"
                          field={`criteriaValues.${criterion.id}`}
                          min={0}
                          max={criterion.goal_number}
                          placeholder={`Score (max: ${criterion.goal_number})`}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <FormItem label="Journal" col={12}>
                {isTemplateExists ? (
                  <FormEditor field="journal" />
                ) : (
                  <FormTextarea
                    field="journal"
                    rows={3}
                    placeholder="Add notes about today's progress..."
                  />
                )}
              </FormItem>
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : 'Submit Evaluation'}
            </Button>
          </div>
        </div>
      </form>
    </FormProvider>
  )
}

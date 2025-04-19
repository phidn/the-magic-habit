import { useFieldArray, useFormContext } from 'react-hook-form'

import { Button, Card, CardContent, CardHeader, CardTitle, PlusIcon, TrashIcon } from '@mazic/ui'
import { FormInput, FormItem } from '@mazic/components/FormControl'

export const CriteriaForm = () => {
  const { control } = useFormContext()

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'criterions',
  })

  const handleAddCriterion = () => {
    append({
      name: '',
      goal_number: 10,
    })
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-2xl font-semibold leading-none tracking-tight">Skill Criteria</h3>
        <Button
          onClick={(e) => {
            e.preventDefault()
            handleAddCriterion()
          }}
          size="sm"
          variant="outline"
        >
          <PlusIcon className="mr-2 h-4 w-4" />
          Add Criterion
        </Button>
      </div>

      {fields.length === 0 && (
        <Card>
          <CardContent className="py-4 text-center text-muted-foreground">
            No criteria added yet. Add criteria to track specific aspects of this skill.
          </CardContent>
        </Card>
      )}

      {fields.map((field, index) => (
        <Card key={field.id} className="overflow-hidden">
          <CardHeader className="py-3 px-4 bg-secondary/20 flex-row justify-between items-center space-y-0">
            <CardTitle className="text-base">Criterion {index + 1}</CardTitle>
            <Button
              onClick={(e) => {
                e.preventDefault()
                remove(index)
              }}
              size="icon"
              variant="ghost"
              className="h-8 w-8 text-muted-foreground hover:text-destructive"
            >
              <TrashIcon className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent>
            <div className="mazic-row">
              <FormItem label="Name" required col={6}>
                <FormInput field={`criterions.${index}.name`} placeholder="e.g., Pronunciation" />
              </FormItem>
              <FormItem label="Goal number" required col={6}>
                <FormInput
                  field={`criterions.${index}.goal_number`}
                  placeholder="e.g., 10"
                  type="number"
                  min={1}
                />
              </FormItem>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

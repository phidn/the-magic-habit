import { useEffect, useState } from 'react'
import { useFormContext } from 'react-hook-form'

import { Card, CardContent, CardDescription, CardHeader, CardTitle, cn, Skeleton } from '@mazic/ui'
import { THabit } from '@mazic/shared'
import SortableList, { SortableItem } from '@mazic/components/EasySort'
import { FormInput, FormItem } from '@mazic/components/FormControl'
import { arrayMove } from '@mazic/utils/utils'

interface IProps {
  habitData: THabit[]
}

export const DashboardSettings = ({ habitData }: IProps) => {
  const methods = useFormContext()
  const habitCols = methods.watch('habit_cols')

  const [items, setItems] = useState<THabit[]>([])

  useEffect(() => {
    setItems(habitData)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(habitData)])

  const onSortEnd = (oldIndex: number, newIndex: number): void => {
    const newItems = arrayMove(items, oldIndex, newIndex)
    setItems(newItems)
    methods.setValue('habit_orders', newItems.map((item) => item.id).join('|'))
  }

  return (
    <div className="mazic-row">
      <div className="mazic-col-12">
        <FormItem label="Column number" required col={6}>
          <FormInput
            min={1}
            max={4}
            type="number"
            field="habit_cols"
            placeholder="Enter number of columns..."
          />
        </FormItem>
      </div>
      <div className="mazic-col-12">
        <SortableList
          onSortEnd={onSortEnd}
          className={cn(
            'select-none grid gap-2',
            habitCols === 2 && 'grid-cols-2',
            habitCols === 3 && 'grid-cols-3',
            habitCols === 4 && 'grid-cols-4'
          )}
        >
          {items.map((item, idx) => (
            <SortableItem key={item.id || idx}>
              <Card className="cursor-grab w-full select-none">
                <CardHeader>
                  <CardTitle>{item.title}</CardTitle>
                  <CardDescription></CardDescription>
                </CardHeader>
                <CardContent>
                  <Skeleton className="w-full h-[150px] rounded-xl" />
                </CardContent>
              </Card>
            </SortableItem>
          ))}
        </SortableList>
      </div>
    </div>
  )
}

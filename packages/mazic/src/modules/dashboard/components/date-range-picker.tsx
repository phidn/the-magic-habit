import * as React from 'react'
import { DateRange } from 'react-day-picker'
import dayjs from 'dayjs'

import {
  Button,
  Calendar,
  CalendarIcon,
  cn,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@mazic-design-system'

export const CalendarDateRangePicker = ({ className }: React.HTMLAttributes<HTMLDivElement>) => {
  const [date, setDate] = React.useState<DateRange | undefined>({
    from: dayjs('2023-01-20').toDate(),
    to: dayjs('2023-01-20').add(20, 'day').toDate(),
  })

  return (
    <div className={cn('grid gap-2', className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={'outline'}
            className={cn(
              'w-[260px] justify-start text-left font-normal',
              !date && 'text-muted-foreground'
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date?.from ? (
              date.to ? (
                <>
                  {dayjs(date.from).format('MMM DD, YYYY')} -{' '}
                  {dayjs(date.to).format('MMM DD, YYYY')}
                </>
              ) : (
                dayjs(date.from).format('MMM DD, YYYY')
              )
            ) : (
              <span>Pick a date</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="end">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={setDate}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}

import dayjs from 'dayjs'

import {
  ScrollArea,
  Spinner,
  Timeline,
  TimelineConnector,
  TimelineContent,
  TimelineDescription,
  TimelineHeader,
  TimelineIcon,
  TimelineItem,
  TimelineTime,
  TimelineTitle,
} from '@mazic/ui'

import { THabit } from '@mazic/modules/habit'

interface Props {
  habits: THabit[]
  isLoading?: boolean
}

type TimelineItem = {
  dateNode: string
  date: string
  title: string
  journal: string
}

export const OverviewTimeline = ({ habits, isLoading }: Props) => {
  const items: TimelineItem[] = habits.reduce((acc, habit) => {
    for (const entry of habit.check_in_items) {
      if (entry.journal) {
        const formattedDate = dayjs(entry.date).format('MMM DD')
        const existingItem = acc.find((item) => item.date === formattedDate)
        acc.push({
          date: formattedDate,
          dateNode: existingItem ? '' : formattedDate,
          title: habit.title,
          journal: entry.journal,
        })
      }
    }
    return acc
  }, [] as TimelineItem[])
  const sortedItems = items.sort((a, b) => dayjs(b.date).diff(dayjs(a.date)))

  return (
    <ScrollArea className="h-[350px] rounded-md border p-4 bg-card">
      {isLoading && <Spinner size="small" className="mt-2" />}
      {!isLoading && (
        <Timeline className="pl-10">
          {sortedItems.map((item, idx) => (
            <TimelineItem key={idx}>
              <TimelineConnector />
              <TimelineHeader>
                <TimelineTime className="translate-x-10 md:-translate-x-14">
                  {item.dateNode}
                </TimelineTime>
                <TimelineIcon />
                <TimelineTitle>{item.title}</TimelineTitle>
              </TimelineHeader>
              <TimelineContent>
                <TimelineDescription>{item.journal}</TimelineDescription>
              </TimelineContent>
            </TimelineItem>
          ))}
        </Timeline>
      )}
    </ScrollArea>
  )
}

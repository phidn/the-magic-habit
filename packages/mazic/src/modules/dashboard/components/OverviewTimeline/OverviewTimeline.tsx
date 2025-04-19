import { useState } from 'react'
import dayjs from 'dayjs'
import { Eye } from 'lucide-react'

import {
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
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
import { THabit } from '@mazic/shared'

interface Props {
  habits: THabit[]
  isLoading?: boolean
}

type TimelineItem = {
  _date: string
  dateNode: string
  date: string
  title: string
  journal: string
}

const isHtml = (str: string) => {
  return /<[a-z][\s\S]*>/i.test(str)
}

export const OverviewTimeline = ({ habits, isLoading }: Props) => {
  const [selectedJournal, setSelectedJournal] = useState<string | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)

  const items: TimelineItem[] = habits.reduce((acc, habit) => {
    for (const entry of habit.check_in_items) {
      if (entry.journal) {
        const formattedDate = dayjs(entry.date).format('MMM DD')
        const existingItem = acc.find((item: any) => item.date === formattedDate)
        acc.push({
          _date: entry.date,
          date: formattedDate,
          dateNode: existingItem ? '' : formattedDate,
          title: habit.title,
          journal: entry.journal,
        })
      }
    }
    return acc
  }, [] as TimelineItem[])
  const sortedItems = items.sort((a, b) => dayjs(b._date).diff(dayjs(a._date)))

  const handleViewHtml = (journal: string) => {
    setSelectedJournal(journal)
    setDialogOpen(true)
  }

  return (
    <>
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
                  <TimelineTitle>
                    {!isHtml(item.journal) && item.title}
                    {isHtml(item.journal) && (
                      <div className="flex items-center gap-2">
                        <span>{item.title}</span>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => handleViewHtml(item.journal)}
                        >
                          <Eye className="ml-1h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </TimelineTitle>
                </TimelineHeader>
                <TimelineContent>
                  {!isHtml(item.journal) && (
                    <TimelineDescription>{item.journal}</TimelineDescription>
                  )}
                </TimelineContent>
              </TimelineItem>
            ))}
          </Timeline>
        )}
      </ScrollArea>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Journal Content</DialogTitle>
          </DialogHeader>
          {selectedJournal && (
            <div
              className="prose prose-sm max-w-none dark:prose-invert"
              dangerouslySetInnerHTML={{ __html: selectedJournal }}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}

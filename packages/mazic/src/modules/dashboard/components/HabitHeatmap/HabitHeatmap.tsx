import ActivityCalendar, { Activity, BlockElement, ThemeInput } from 'react-activity-calendar'
import { Link } from 'react-router-dom'
import dayjs from 'dayjs'
import advancedFormat from 'dayjs/plugin/advancedFormat'

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  EllipsisVerticalIcon,
  TooltipProvider,
} from '@mazic-design-system'

import { colors, getThemeColor } from '@mazic/config/baseColors'
import { useTheme } from '@mazic/contexts/ThemeProvider'
import { habitApis } from '@mazic/modules/habit/apis'
import { THabit } from '@mazic/modules/habit/validations'
import { useStoreShallow } from '@mazic/store/useStore'

import { ActivityBlock } from './ActivityBlock'

dayjs.extend(advancedFormat)

interface Props {
  habit: THabit
  refetch: () => void
}

export const HabitHeatmap = ({ habit, refetch }: Props) => {
  const { title, activities, metric } = habit || {}
  const { mode } = useTheme()

  const habitColor = getThemeColor(habit?.color)
  const minimalTheme: ThemeInput = {
    light: [colors.slate[1].hex, `hsl(${habitColor?.activeColor.light})`],
    dark: [colors.slate[8].hex, `hsl(${habitColor?.activeColor.dark})`],
  }
  const activeModeColor = `hsl(${habitColor?.activeColor?.[mode]})`

  const renderBlock = (block: BlockElement, activity: Activity) => {
    return (
      <ActivityBlock block={block} activity={activity} color={activeModeColor} metric={metric} />
    )
  }

  const mutationDelete = habitApis.delete()
  const [hideModal, showModalDelete] = useStoreShallow((state) => [
    state.hideModal,
    state.showModalDelete,
  ])

  if (!activities?.length) {
    return null
  }

  return (
    <div className="w-full m-2">
      <Card>
        <CardHeader className="flex flex-col items-start justify-between space-y-2 py-4 sm:flex-row sm:items-center sm:space-y-0 md:h-16">
          <CardTitle>{title}</CardTitle>
          <div className="ml-auto flex w-full space-x-2 sm:justify-end">
            <DropdownMenu>
              <DropdownMenuTrigger>
                <EllipsisVerticalIcon />
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem className="cursor-pointer">
                  <Link className="w-full" to={`/habit/edit/${habit.id}`}>
                    Edit
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="cursor-pointer text-red-600"
                  onClick={() => {
                    showModalDelete({
                      onConfirm: () => {
                        mutationDelete.mutate(habit.id as string, {
                          onSuccess: () => {
                            hideModal()
                            refetch()
                          },
                        })
                      },
                    })
                  }}
                >
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>
        <CardContent className="flex justify-center">
          <TooltipProvider delayDuration={300}>
            <ActivityCalendar
              colorScheme={mode}
              data={activities || []}
              renderBlock={renderBlock}
              hideTotalCount
              showWeekdayLabels
              theme={minimalTheme}
              blockSize={15}
            />
          </TooltipProvider>
        </CardContent>
      </Card>
    </div>
  )
}

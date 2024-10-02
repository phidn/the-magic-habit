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

import HeatMap from '@mazic/components/HeatMap'
import { colors } from '@mazic/config/baseColors'
import { useColorMode } from '@mazic/hooks'
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
  const { title, activities, color } = habit || {}
  const { mode, colorMode: activeModeColor } = useColorMode(color)

  const bgColor = mode === 'dark' ? colors.slate[9].hex : colors.slate[1].hex

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
        <CardHeader className="flex justify-between py-4 flex-row items-center space-y-0">
          <CardTitle>{title}</CardTitle>
          <div className="ml-auto flex w-full space-x-2 justify-end">
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
        <CardContent className="flex justify-center h-48">
          <TooltipProvider delayDuration={300}>
            <HeatMap
              width={900}
              startDate={dayjs('2024-01-01').toDate()}
              endDate={dayjs('2024-12-31').toDate()}
              value={activities}
              legendCellSize={15}
              rectSize={15}
              weekLabels={['', 'Mon', '', 'Wed', '', 'Fri', '']}
              panelColors={{
                0: bgColor,
                1: colors[habit.color][2].hex,
                2: colors[habit.color][3].hex,
                3: colors[habit.color][4].hex,
                4: activeModeColor,
              }}
              rectRender={(props, data) => {
                return (
                  <ActivityBlock
                    svgProps={props}
                    data={data}
                    habit={habit}
                    color={activeModeColor}
                    rx={3}
                    refetch={refetch}
                  />
                )
              }}
              rectProps={{ rx: 3 }}
            />
          </TooltipProvider>
        </CardContent>
      </Card>
    </div>
  )
}

import { Link } from 'react-router-dom'
import dayjs from 'dayjs'
import advancedFormat from 'dayjs/plugin/advancedFormat'

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  cn,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  EllipsisVerticalIcon,
  ScrollArea,
  ScrollBar,
} from '@mazic/ui'

import HeatMap from '@mazic/components/HeatMap'
import { colors } from '@mazic/config/baseColors'
import { useColorMode } from '@mazic/hooks'
import { THabit } from '@mazic/modules/habit'
import { useStoreShallow } from '@mazic/store/useStore'

import { useDeleteCheckIn } from '../../hooks/apis'
import { checkInType } from '../../utils/utils'

import { ActivityBlock } from './ActivityBlock'

dayjs.extend(advancedFormat)

interface Props {
  habit: THabit
  refetch: () => void
  className?: string
}

export const CheckInHeatmap = ({ habit, refetch, className }: Props) => {
  const { title, activities, color } = habit || {}
  const isNumberCheckIn = habit.check_in_type === checkInType.NUMBER

  const { mode, colorMode: activeModeColor } = useColorMode(color)

  const bgColor = mode === 'dark' ? colors.slate[9].hex : colors.slate[1].hex

  const mutationDelete = useDeleteCheckIn()
  const [hideModal, showModalDelete] = useStoreShallow((state) => [
    state.hideModal,
    state.showModalDelete,
  ])

  const endDate = dayjs().endOf('month').add(1, 'month')
  const startDate = endDate.subtract(1, 'year')

  return (
    <div className={cn('w-full', className)}>
      <Card>
        <CardHeader className="flex justify-between py-4 flex-row items-center space-y-0">
          <CardTitle>{title}</CardTitle>
          <div className="ml-auto flex w-full space-x-2 justify-end">
            <DropdownMenu>
              <DropdownMenuTrigger>
                <EllipsisVerticalIcon className="no-focus" />
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
          <HeatMap
            width={900}
            startDate={startDate.toDate()}
            endDate={endDate.toDate()}
            value={activities}
            legendCellSize={15}
            rectSize={15}
            weekLabels={['', 'Mon', '', 'Wed', '', 'Fri', '']}
            panelColors={
              isNumberCheckIn
                ? {
                    0: bgColor,
                    1: colors[habit.color][2].hex,
                    2: colors[habit.color][3].hex,
                    3: colors[habit.color][4].hex,
                    4: activeModeColor,
                  }
                : {
                    0: bgColor,
                    4: activeModeColor,
                  }
            }
            rectRender={(props, data) => {
              return (
                <ActivityBlock
                  svgProps={props}
                  data={data}
                  habit={habit}
                  color={activeModeColor}
                  rx={3}
                  refetch={refetch}
                  isNumberCheckIn={isNumberCheckIn}
                />
              )
            }}
            rectProps={{ rx: 3 }}
          />
        </CardContent>
      </Card>
    </div>
  )
}

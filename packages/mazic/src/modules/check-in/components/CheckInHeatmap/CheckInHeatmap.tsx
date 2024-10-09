import { useState } from 'react'
import { Link, useMatch } from 'react-router-dom'
import dayjs from 'dayjs'
import advancedFormat from 'dayjs/plugin/advancedFormat'

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  cn,
  CopyIcon,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  EditIcon,
  EllipsisVerticalIcon,
  TooltipProvider,
  TrashIcon,
} from '@mazic/ui'

import HeatMap from '@mazic/components/HeatMap'
import { colors } from '@mazic/config/baseColors'
import { CONFIG, PATH_ROUTE } from '@mazic/config/config'
import { useColorMode, useCopy } from '@mazic/hooks'
import { THabit, useDeleteHabit } from '@mazic/modules/habit'
import { useStoreShallow } from '@mazic/store/useStore'

import { checkInType } from '../../utils/utils'

import { ActivityBlock } from './ActivityBlock'

dayjs.extend(advancedFormat)

interface Props {
  habit: THabit | undefined
  isLoading?: boolean
  className?: string
  onDelete?: (id: string) => void
  refetch: () => void
}

export const CheckInHeatmap = ({ habit, isLoading, className, refetch, onDelete }: Props) => {
  const copy = useCopy()
  const mutationDelete = useDeleteHabit()
  const [hideModal, showModalDelete] = useStoreShallow((state) => [
    state.hideModal,
    state.showModalDelete,
  ])
  const [deletedBlock, setDeletedBlock] = useState<string[]>([])
  const { title, activities, color } = habit || {}
  const blocks = (activities || []).filter((x) => !deletedBlock.includes(x.id))

  const { mode, colorMode: activeModeColor } = useColorMode(color)
  const bgColor = mode === 'dark' ? colors.slate[9].hex : colors.slate[1].hex
  const endDate = dayjs().endOf('month').add(1, 'month')
  const startDate = endDate.subtract(1, 'year')
  const isWidget = !!useMatch(PATH_ROUTE.widget)
  const isNumberCheckIn = habit?.check_in_type === checkInType.NUMBER

  return (
    <div className={cn('w-full', className)}>
      <Card>
        <CardHeader
          isLoading={isLoading}
          className="flex justify-between py-4 flex-row items-center space-y-0"
        >
          <CardTitle>{title}</CardTitle>
          {!isWidget && (
            <div className="ml-auto flex w-full space-x-2 justify-end">
              <DropdownMenu modal={false}>
                <DropdownMenuTrigger className="focus:outline-none">
                  <EllipsisVerticalIcon />
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem
                    className="cursor-pointer"
                    onClick={() =>
                      copy(
                        `${CONFIG.domain}${PATH_ROUTE.widget.replace(':api_key', habit?.api_key || '')}`
                      )
                    }
                  >
                    <CopyIcon className="mr-1" /> Copy Magic Link
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer">
                    <Link className="flex items-center" to={`/habit/edit/${habit?.id}`}>
                      <EditIcon className="mr-1" /> Edit
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="cursor-pointer text-red-600"
                    onClick={() => {
                      showModalDelete({
                        onConfirm: () => {
                          mutationDelete.mutate(habit?.id as string, {
                            onSuccess: () => {
                              hideModal()
                              onDelete?.(habit?.id as string)
                            },
                          })
                        },
                      })
                    }}
                  >
                    <TrashIcon className="mr-1" /> Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}
        </CardHeader>
        <CardContent isLoading={isLoading} className="flex justify-center">
          <TooltipProvider delayDuration={300}>
            <HeatMap
              width={900}
              startDate={startDate.toDate()}
              endDate={endDate.toDate()}
              value={blocks}
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
                    isNumberCheckIn={isNumberCheckIn}
                    isWidget={isWidget}
                    onDelete={(id) => setDeletedBlock((prev) => [...prev, id])}
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

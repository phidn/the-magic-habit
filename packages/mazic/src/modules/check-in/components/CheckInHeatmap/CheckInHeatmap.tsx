import { useMemo, useState } from 'react'
import { Link, useMatch } from 'react-router-dom'
import { Tooltip } from 'react-tooltip'
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
  ScrollArea,
  ScrollBar,
  SeedlingIcon,
  TrashIcon,
} from '@mazic/ui'

import { CopyLinkModal } from '@mazic/components'
import HeatMap from '@mazic/components/HeatMap'
import { colors } from '@mazic/config/baseColors'
import { CONFIG } from '@mazic/config/config'
import { pathRoutes } from '@mazic/config/pathRoutes'
import { useAppContext, useColorMode } from '@mazic/hooks'
import useRect from '@mazic/hooks/useRect'
import { useStoreShallow } from '@mazic/store/useStore'
import { THabit } from '@mazic/types/modules'
import { pluralize } from '@mazic/utils/pluralize'

import { checkInType } from '../../utils/utils'

import { ActivityBlock } from './ActivityBlock'

dayjs.extend(advancedFormat)

interface Props {
  habit: THabit
  isLoading?: boolean
  className?: string
  onDelete?: (id: string) => void
  refetch: () => void
}

export const CheckInHeatmap = ({ habit, isLoading, className, refetch, onDelete }: Props) => {
  const { hooks } = useAppContext()
  const mutationDelete = hooks.useDeleteHabit()
  const [hideModal, showModalDelete, showModal] = useStoreShallow((state) => [
    state.hideModal,
    state.showModalDelete,
    state.showModal,
  ])

  const [ref, rect] = useRect<HTMLDivElement>()
  const isSmallScreen = !!(rect?.width && rect.width < 900)

  const [deletedBlock, setDeletedBlock] = useState<string[]>([])

  const { title, activities, color } = habit || {}

  const blocks = useMemo(() => {
    return (activities || []).filter((x) => !deletedBlock.includes(x.id))
  }, [activities, deletedBlock])

  const { mode, colorMode: activeModeColor } = useColorMode(color)
  const bgColor = mode === 'dark' ? colors.slate[9].hex : colors.slate[1].hex
  const endDate = dayjs().endOf('month').add(1, 'month')
  const startDate = endDate.subtract(1, 'year')
  const isWidget = !!useMatch(pathRoutes.checkIn.widget)
  const isNumberCheckIn = habit?.check_in_type === checkInType.INPUT_NUMBER

  const panelColors = isNumberCheckIn
    ? {
        0: bgColor,
        1: colors[habit.color][2].hex,
        2: colors[habit.color][3].hex,
        3: colors[habit.color][4].hex,
        4: activeModeColor,
      }
    : {
        0: bgColor,
        4: colors[habit.color][3].hex,
      }

  if (!habit) {
    return null
  }

  return (
    <div className={cn('w-full', className)} ref={ref}>
      <Card>
        <CardHeader
          isLoading={isLoading}
          className="flex justify-between py-4 flex-row items-center space-y-0"
        >
          <CardTitle>{title}</CardTitle>
          {!isWidget && (
            <div className="ml-auto flex space-x-2 justify-end">
              <DropdownMenu modal={false}>
                <DropdownMenuTrigger className="focus:outline-none">
                  <EllipsisVerticalIcon />
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem
                    className="cursor-pointer"
                    onClick={() => {
                      showModal({
                        open: true,
                        showConfirm: false,
                        title: 'Widget link',
                        description: 'Anyone who has this link will be able to view this.',
                        body: (
                          <CopyLinkModal
                            link={`${CONFIG.domain}${pathRoutes.checkIn.widget.replace(':api_key', habit?.api_key || '')}`}
                          />
                        ),
                      })
                    }}
                  >
                    <CopyIcon className="mr-1" />
                    Widget Link
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer">
                    <Link className="flex items-center w-full" to={`/habit/edit/${habit?.id}`}>
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
        <CardContent isLoading={isLoading} className="flex justify-center relative">
          <ScrollArea className="h-auto pb-5">
            <HeatMap
              width={900}
              startDate={startDate.toDate()}
              endDate={endDate.toDate()}
              value={blocks}
              legendCellSize={15}
              rectSize={15}
              weekLabels={['', 'Mon', '', 'Wed', '', 'Fri', '']}
              panelColors={panelColors as Record<number, string>}
              rectRender={(svgProps, data) => {
                return (
                  <ActivityBlock
                    svgProps={svgProps}
                    data={data}
                    habit={habit}
                    panelColors={panelColors as Record<number, string>}
                    color={activeModeColor}
                    rx={3}
                    scrollToToday={isSmallScreen}
                    onDelete={(id) => setDeletedBlock((prev) => [...prev, id])}
                    refetch={refetch}
                  />
                )
              }}
              rectProps={{ rx: 3 }}
            />
            <Tooltip id={`my-tooltip-${habit.id}`} variant={mode === 'dark' ? 'dark' : 'light'} />
            <ScrollBar orientation="horizontal" />
            {isNumberCheckIn && (
              <div className={cn('absolute top-[150px] left-0', !isSmallScreen && 'pl-6')}>
                <div className="flex items-center gap-2">
                  <SeedlingIcon className="h-4 w-4" color={activeModeColor} />{' '}
                  <p className="text-sm text-secondary-foreground font-bold">
                    Daily average:{' '}
                    <span className="font-semibold" style={{ color: activeModeColor }}>
                      {(habit?.meta?.avg || 0).toFixed(2)}{' '}
                      {pluralize(habit.metric, habit?.meta?.avg)}
                    </span>
                  </p>
                </div>
              </div>
            )}
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  )
}

import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import { cn, Tabs, TabsContent, TabsList, TabsTrigger } from '@mazic/ui'
import { THabit } from '@mazic/shared'
import { NoData } from '@mazic/components'
import { pathRoutes } from '@mazic/config/pathRoutes'
import { useAppContext } from '@mazic/hooks'
import { CheckInHeatmap } from '@mazic/modules/check-in'
import { DashboardTab } from '@mazic/store/slices/viewSlice'
import { useStore, useStoreShallow } from '@mazic/store/useStore'

import { DailyCheckIn } from './components/DailyCheckIn/DailyCheckIn'
import { Overview } from './components/Overview/Overview'
import { OverviewTimeline } from './components/OverviewTimeline/OverviewTimeline'

const DashboardPage = () => {
  const { id: habitId } = useParams()

  const navigate = useNavigate()
  const { hooks } = useAppContext()

  const user = useStore((state) => state.currentUser.user)
  const [listHabits, setListHabits] = useState<THabit[]>([])
  const [activeTab, setActiveTab] = useStoreShallow((state) => [
    state.view.dashboardActiveTab,
    state.setDashboardActiveTab,
  ])

  const { data, isPending, refetch } = hooks.useListHabit({
    pageSize: -1,
    entry_expand: true,
    habit_id: habitId,
  })

  const [deleted, setDeleted] = useState<string[]>([])
  const onDelete = (id: string) => setDeleted([...deleted, id])

  useEffect(() => {
    let _listHabits = data.filter((x) => !deleted.includes(x.id))
    const settingOrders = (user?.setting?.habit_orders || '').split('|')
    if (settingOrders.length) {
      _listHabits = _listHabits.sort(
        (a, b) => settingOrders.indexOf(a.id) - settingOrders.indexOf(b.id)
      )
    }
    setListHabits(_listHabits)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify({ data, deleted, user })])

  if (!listHabits?.length) {
    return (
      <NoData
        title="Make it so easy you can't say no"
        description="Create your first habit and start tracking your progress."
        action={{
          label: 'Create Habit',
          onClick: () => navigate(pathRoutes.habit.create),
        }}
      />
    )
  }

  const settingCols = user?.setting?.habit_cols || 1

  return (
    <div>
      <div className="mazic-row">
        <div className="mazic-col-8">
          <Overview habits={listHabits} isLoading={isPending} />
        </div>
        <div className="mazic-col-4">
          <OverviewTimeline habits={listHabits} isLoading={isPending} />
        </div>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={(value) => setActiveTab(value as DashboardTab)}
        className="w-full mt-4"
      >
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="heatmap">Heatmap</TabsTrigger>
          <TabsTrigger value="daily-checkin">Daily Check-in</TabsTrigger>
        </TabsList>

        <TabsContent value="heatmap" className="mt-4">
          <div
            className={cn(
              'w-full grid gap-2',
              settingCols === 1 && 'grid-cols-1',
              settingCols === 2 && 'grid-cols-2',
              settingCols === 3 && 'grid-cols-3',
              settingCols === 4 && 'grid-cols-4',
              habitId && 'grid-cols-1'
            )}
          >
            {listHabits.map((habit, idx) => {
              return (
                <CheckInHeatmap
                  isDetail={!!habitId}
                  key={habit?.id || idx}
                  habit={habit}
                  className="my-2"
                  isLoading={isPending}
                  refetch={refetch}
                  onDelete={onDelete}
                />
              )
            })}
          </div>
        </TabsContent>

        <TabsContent value="daily-checkin" className="mt-4">
          <DailyCheckIn
            habits={listHabits}
            isLoading={isPending}
            refetch={refetch}
            onDelete={onDelete}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default DashboardPage

import { useNavigate } from 'react-router-dom'

import { NoDataCta } from '@mazic/components'
import { CheckInHeatmap } from '@mazic/modules/check-in'
import { useListHabit } from '@mazic/modules/habit'

import { Overview } from './components/Overview/Overview'
import { OverviewTimeline } from './components/OverviewTimeline/OverviewTimeline'

const DashboardPage = () => {
  const {
    data: listHabits,
    refetch,
    isFetching,
  } = useListHabit({ pageSize: -1, entry_expand: true })
  const navigate = useNavigate()

  if (!listHabits?.length) {
    return (
      <NoDataCta
        title="Make it so easy you can't say no"
        description="Create your first habit and start tracking your progress."
        action={{
          label: 'Create Habit',
          onClick: () => navigate('/habit/new'),
        }}
      />
    )
  }

  return (
    <div>
      <div className="mazic-row">
        <div className="mazic-col-8">
          <Overview habits={listHabits} range="MONTH" isLoading={isFetching} />
        </div>
        <div className="mazic-col-4">
          <OverviewTimeline habits={listHabits} isLoading={isFetching} />
        </div>
      </div>
      <div className="mazic-row mt-2">
        {listHabits.map((habit, idx) => {
          return (
            <CheckInHeatmap
              key={habit?.id || idx}
              habit={habit}
              refetch={refetch}
              className="my-2"
              isLoading={isFetching}
            />
          )
        })}
      </div>
    </div>
  )
}

export default DashboardPage

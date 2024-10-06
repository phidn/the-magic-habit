import { useListHabit } from '../habit/apis'

import { HabitHeatmap } from './components/HabitHeatmap/HabitHeatmap'
import { Overview } from './components/Overview/Overview'
import { OverviewTimeline } from './components/OverviewTimeline/OverviewTimeline'
import { DashboardStyled } from './styled'

const DashboardPage = () => {
  const { data: listHabits, refetch } = useListHabit({ pageSize: -1, entry_expand: true })

  return (
    <DashboardStyled>
      <div className="mazic-row">
        {!!listHabits?.length && (
          <>
            <div className="mazic-col-8">
              <Overview habits={listHabits} range="MONTH" />
            </div>
            <div className="mazic-col-4">
              <OverviewTimeline habits={listHabits} />
            </div>
          </>
        )}
      </div>
      <div className="mazic-row mt-2">
        {listHabits.map((habit, idx) => {
          return <HabitHeatmap key={habit?.id || idx} habit={habit} refetch={refetch} />
        })}
      </div>
    </DashboardStyled>
  )
}

export default DashboardPage

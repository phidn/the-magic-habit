import { habitApis } from '../habit/apis'

import { HabitHeatmap } from './components/HabitHeatmap/HabitHeatmap'
import { Overview } from './components/Overview/Overview'
import { DashboardStyled } from './styled'

const DashboardPage = () => {
  const { data: listHabits, refetch } = habitApis.useList({ pageSize: -1 })

  return (
    <DashboardStyled>
      <div className="mazic-row">
        <div className="mazic-col-4">
          <Overview />
        </div>
        <div className="mazic-col-4">
          <Overview />
        </div>
        <div className="mazic-col-4">
          <Overview />
        </div>
      </div>
      <div className="mazic-row mt-12">
        {listHabits.map((habit, idx) => {
          return <HabitHeatmap key={habit?.id || idx} habit={habit} refetch={refetch} />
        })}
      </div>
    </DashboardStyled>
  )
}

export default DashboardPage

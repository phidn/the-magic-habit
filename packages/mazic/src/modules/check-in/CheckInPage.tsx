import { useParams } from 'react-router-dom'

import { CheckInHeatmap } from './components/CheckInHeatmap/CheckInHeatmap'
import { useFindWidget } from './hooks/useCheckInApis'

const CheckInPage = () => {
  const { api_key } = useParams()
  const { data, refetch, isPending } = useFindWidget(api_key as string)

  return (
    <div className="p-2 lg:px-0 mx-auto w-full max-w-[1000px] min-h-screen flex items-center">
      {data && <CheckInHeatmap isLoading={isPending} habit={data} refetch={refetch} />}
    </div>
  )
}

export default CheckInPage

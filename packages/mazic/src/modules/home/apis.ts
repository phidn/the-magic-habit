import { useQuery } from '@tanstack/react-query'

import http from '@mazic/utils/http'

const QUERY_KEY = 'leaderboard' as const

export const useGetLeaderboard = () => {
  const { data, ...rest } = useQuery({
    queryFn: () => http.get('/leaderboard'),
    queryKey: [QUERY_KEY, 'getLeaderboard'],
  })

  return { ...data?.data, ...rest }
}

import React from 'react'
import { Appbar } from 'react-native-paper'

import PageContainer from '@/components/Containers/PageContainer'

import { useListHabitApi } from '../habit/apis'

import JournalAgenda from './JournalAgenda'

export const TimelineJournalScreen = () => {
  const { data, refetch, isRefetching, isFetching } = useListHabitApi({
    pageSize: -1,
    entry_expand: true,
  })

  return (
    <PageContainer
      renderAppbar={() => {
        return (
          <Appbar.Header elevated>
            <Appbar.Content title="Timeline Journal" titleStyle={{ fontSize: 17 }} />
          </Appbar.Header>
        )
      }}
      isLoading={isFetching || isRefetching}
    >
      <JournalAgenda refetch={refetch} isRefetching={isRefetching} data={data} />
    </PageContainer>
  )
}

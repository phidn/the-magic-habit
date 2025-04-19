import dayjs from 'dayjs'

import { HeatMapValue, TCheckIn, THabit } from '@mazic/shared'

export const normalizeHabitData = (data: THabit[]): THabit[] => {
  return data.map((item) => ({
    ...item,
    activities: getActivities(item.check_in_items),
  }))
}

export const getActivities = (data?: TCheckIn[]): HeatMapValue[] => {
  return (data || []).map((entry) => ({
    id: entry.id,
    date: dayjs(entry.date).format('YYYY/MM/DD'),
    count: entry.count,
    level: entry.level,
    journal: entry.journal,
    is_done: entry.is_done,
    criterion_id: entry.criterion_id,
    criterion_values: entry.criterion_values,
  }))
  // if (!isMultiCriteria) {
  // }

  // if (isMultiCriteria) {
  //   const _data = (data || []).filter((x) => x.criterion_id)
  //   const groupedByDate = (_data || []).reduce(
  //     (acc, entry) => {
  //       const date = dayjs(entry.date).format('YYYY/MM/DD')
  //       if (!acc[date]) {
  //         acc[date] = {
  //           id: `${entry.id}-${entry.criterion_id}__${date}`,
  //           date,
  //           count: 0,
  //           level: 0,
  //           journal: entry.journal,
  //           is_done: entry.is_done,
  //           criterion_values: [],
  //         }
  //       }
  //       acc[date].count += entry.count
  //       acc[date].level = Math.max(acc[date].level, entry.level)

  //       acc[date].criterion_values = acc[date].criterion_values || []
  //       acc[date].criterion_values.push({
  //         criterion_id: entry.criterion_id as string,
  //         value: entry.value,
  //       })

  //       return acc
  //     },
  //     {} as Record<string, HeatMapValue>
  //   )
  //   return Object.values(groupedByDate)
  // }

  // return []
}

export const EQ_CHECK_IN_TEMPLATE = {
  reflection: `<p class="text-node"><em>1/ Hôm nay mình đang cảm thấy:</em></p><p class="text-node">→&nbsp;</p><p class="text-node"><em>2/ Có chuyện gì đã kích hoạt cảm xúc này?</em></p><p class="text-node">→&nbsp;</p><p class="text-node"><em>3/ Mình đã phản ứng như thế nào?</em></p><p class="text-node">→&nbsp;</p><p class="text-node"><em>4/ Nếu mình dừng lại được, điều gì đã giúp mình làm được điều đó?</em></p><p class="text-node">→&nbsp;</p><p class="text-node"><em>5/ Hôm nay mình học được điều gì từ cảm xúc này?</em></p><p class="text-node">→&nbsp;</p>`,
  lite: `<p class="text-node"><em>1/ Hôm nay mình đang cảm thấy:</em></p><p class="text-node">→&nbsp;</p><p class="text-node"><em>2/ Lý do mình có cảm xúc đó? Điều gì khiến cho mình có cảm xúc ấy??</em></p><p class="text-node">→&nbsp;</p>`,
}

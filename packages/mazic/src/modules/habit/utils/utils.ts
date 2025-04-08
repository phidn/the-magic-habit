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
  }))
}

export const EQ_CHECK_IN_TEMPLATE = {
  reflection: `<p class="text-node"><em>1/ Hôm nay mình đang cảm thấy:</em></p><p class="text-node">→&nbsp;</p><p class="text-node"><em>2/ Có chuyện gì đã kích hoạt cảm xúc này?</em></p><p class="text-node">→&nbsp;</p><p class="text-node"><em>3/ Mình đã phản ứng như thế nào?</em></p><p class="text-node">→&nbsp;</p><p class="text-node"><em>4/ Nếu mình dừng lại được, điều gì đã giúp mình làm được điều đó?</em></p><p class="text-node">→&nbsp;</p><p class="text-node"><em>5/ Hôm nay mình học được điều gì từ cảm xúc này?</em></p><p class="text-node">→&nbsp;</p>`,
  lite: `<p class="text-node"><em>1/ Bạn cảm thấy thế nào? Những cảm xúc mà bạn trải qua?</em></p><p class="text-node">→&nbsp;</p><p class="text-node"><em>2/ Bạn đã hành động ra sao, và suy nghĩ của bạn về tình huống đó là gì?</em></p><p class="text-node">→&nbsp;</p>`,
}

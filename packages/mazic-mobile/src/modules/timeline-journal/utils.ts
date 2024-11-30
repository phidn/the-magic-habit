import { isEmpty } from 'lodash'

export function getMarkedDates(_agendaItems: any) {
  const marked: any = {}

  _agendaItems.forEach((item: any) => {
    if (item?.data && item?.data?.length > 0 && !isEmpty(item?.data[0])) {
      marked[item?.title] = { marked: true }
    } else {
      marked[item?.title] = { disabled: true }
    }
  })
  return marked
}

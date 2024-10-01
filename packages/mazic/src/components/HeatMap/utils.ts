import { HeatMapValue, SVGProps } from './SVG'

export const oneDayTime = 24 * 60 * 60 * 1000

export function isValidDate(date: Date) {
  return date instanceof Date && !isNaN(date.getTime())
}

export function getDateToString(date: Date) {
  return `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`
}

export function formatData(data: SVGProps['value'] = []) {
  const result: Record<string, HeatMapValue> = {}
  data.forEach((item) => {
    if (item.date && isValidDate(new Date(item.date))) {
      item.date = getDateToString(new Date(item.date))
      result[item.date] = item
    }
  })
  return result
}

export function numberSort(keys: number[] = []) {
  return keys.sort((x, y) => {
    if (x < y) return -1
    else if (x > y) return 1
    return 0
  })
}

export function existColor(num = 0, nums: number[], panelColors: Record<number, string> = {}) {
  let color = ''
  for (let index = 0; index < nums.length; index += 1) {
    if (nums[index] > num) {
      color = panelColors[nums[index]]
      break
    }
    color = panelColors[nums[index]]
  }
  return color
}

import { FC, PropsWithChildren, useMemo } from 'react'

import { Rect, RectProps } from './Rect'
import { SVGProps } from './SVG'
import { formatData, getDateToString, oneDayTime } from './utils'

type DayProps = {
  transform?: string
  gridNum?: number
  initStartDate: Date
  endDate?: Date
  rectProps?: RectProps
  rectSize?: number
  space?: number
  startY?: number
  rectRender?: SVGProps['rectRender']
  panelColors?: SVGProps['panelColors']
  value?: SVGProps['value']
}

export const Day: FC<PropsWithChildren<DayProps>> = (props) => {
  const {
    transform,
    gridNum = 0,
    panelColors = {},
    initStartDate,
    space = 2,
    value = [],
    rectSize = 11,
    endDate,
    rectProps,
    rectRender,
  } = props

  const data = useMemo(() => formatData(value), [value])

  if (gridNum <= 0) return null

  return (
    <g transform={transform}>
      {[...Array(gridNum)].map((_, idx) => {
        return (
          <g key={idx} data-column={idx}>
            {[...Array(7)].map((_, cidx) => {
              const currentDate = new Date(initStartDate.getTime() + oneDayTime * (idx * 7 + cidx))
              const date = getDateToString(currentDate)
              const dataProps: RectProps['value'] = {
                ...data[date],
                date: date,
                row: cidx,
                column: idx,
                index: idx * 7 + cidx,
              }
              const dayProps: RectProps = {
                ...rectProps,
                fill: 'var(--rhm-rect, #EBEDF0)',
                width: rectSize,
                height: rectSize,
                x: idx * (rectSize + space),
                y: (rectSize + space) * cidx,
                render: rectRender,
                value: dataProps,
              }

              if (endDate instanceof Date && currentDate.getTime() > endDate.getTime()) {
                return null
              }
              if (date && data[date] && panelColors && Object.keys(panelColors).length > 0) {
                dayProps.fill = panelColors[data[date].level] || panelColors[0]
              } else if (panelColors && panelColors[0]) {
                dayProps.fill = panelColors[0]
              }

              return (
                <Rect
                  {...dayProps}
                  key={cidx}
                  value={dataProps}
                  data-date={date}
                  data-index={dataProps.index}
                  data-row={dataProps.row}
                  data-column={dataProps.column}
                />
              )
            })}
          </g>
        )
      })}
    </g>
  )
}

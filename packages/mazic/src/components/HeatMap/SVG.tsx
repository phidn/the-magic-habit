import React, { CSSProperties, useEffect, useMemo, useState } from 'react'

import { HeatMapValue } from '@mazic/shared'

import { Day } from './Day'
import { LabelsMonth } from './LabelsMonth'
import { LabelsWeek } from './LabelsWeek'
import Legend, { LegendProps } from './Legend'
import { RectProps } from './Rect'
import { isValidDate, oneDayTime } from './utils'

export interface SVGProps extends React.SVGProps<SVGSVGElement> {
  startDate?: Date
  endDate?: Date
  rectSize?: number
  legendCellSize?: number
  space?: number
  rectProps?: RectProps
  legendRender?: LegendProps['legendRender']
  rectRender?: (
    svgProps: React.SVGProps<SVGRectElement>,
    value: HeatMapValue
  ) => React.ReactElement | void
  value?: Array<HeatMapValue>
  weekLabels?: string[] | false
  monthLabels?: string[] | false
  monthPlacement?: 'top' | 'bottom'
  panelColors?: Record<number, string>
}

export default function SVG(props: SVGProps) {
  const {
    rectSize = 11,
    legendCellSize = 11,
    space = 2,
    monthPlacement = 'top',
    startDate = new Date(),
    endDate,
    rectProps,
    rectRender,
    legendRender,
    value = [],
    weekLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    monthLabels = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ],
    panelColors = {
      0: 'var(--rhm-rect, #EBEDF0)',
      8: '#7BC96F',
      4: '#C6E48B',
      12: '#239A3B',
      32: '#196127',
    },
    style,
    ...other
  } = props || {}
  const [gridNum, setGridNum] = useState(0)
  const [leftPad, setLeftPad] = useState(weekLabels !== undefined ? 28 : 5)

  const defaultTopPad = monthPlacement === 'top' ? 20 : 5
  const [topPad, setTopPad] = useState(monthLabels !== undefined ? defaultTopPad : 5)
  const svgRef = React.createRef<SVGSVGElement>()
  useEffect(() => setLeftPad(weekLabels !== undefined ? 28 : 5), [weekLabels])
  useEffect(() => {
    if (svgRef.current) {
      const width = svgRef.current.clientWidth - leftPad || 0
      setGridNum(Math.floor(width / (rectSize + space)) || 0)
    }
  }, [rectSize, svgRef, space, leftPad])

  useEffect(() => {
    setTopPad(monthLabels !== undefined ? defaultTopPad : 5)
  }, [defaultTopPad, monthLabels])

  const initStartDate = useMemo(() => {
    if (isValidDate(startDate)) {
      return !startDate.getDay()
        ? startDate
        : new Date(startDate.getTime() - startDate.getDay() * oneDayTime)
    } else {
      const newDate = new Date()
      return new Date(newDate.getTime() - newDate.getDay() * oneDayTime)
    }
  }, [startDate])

  const _style = {
    color: 'var(--rhm-text-color, #24292e)',
    userSelect: 'none',
    display: 'block',
    fontSize: 10,
  } as CSSProperties

  const monthRectY = monthPlacement === 'top' ? 15 : 15 * 7 + space
  const legendTopPad =
    monthPlacement === 'top'
      ? topPad + rectSize * 8 + 6
      : (monthLabels !== undefined ? topPad + rectSize + space : topPad) + rectSize * 8 + 6

  return (
    <div>
      <svg ref={svgRef} style={{ ..._style, ...style }} {...other}>
        <LabelsWeek weekLabels={weekLabels} rectSize={rectSize} space={space} topPad={topPad} />
        <LabelsMonth
          monthLabels={monthLabels}
          rectSize={rectSize}
          space={space}
          leftPad={leftPad}
          colNum={gridNum}
          rectY={monthRectY}
          startDate={initStartDate}
        />
        <Day
          transform={`translate(${leftPad}, ${topPad})`}
          gridNum={gridNum}
          initStartDate={initStartDate}
          endDate={endDate}
          rectProps={rectProps}
          rectSize={rectSize}
          rectRender={rectRender}
          panelColors={panelColors}
          value={value}
          space={space}
        />
      </svg>
      <svg
        style={{
          height: rectSize,
          float: 'right',
          width: Object.values(panelColors)?.length === 2 ? 40 : 95,
        }}
      >
        {legendCellSize !== 0 && (
          <Legend
            legendRender={legendRender}
            panelColors={panelColors}
            rectSize={rectSize}
            rectY={legendTopPad}
            legendCellSize={legendCellSize}
            leftPad={leftPad}
            topPad={topPad}
            space={space}
          />
        )}
      </svg>
    </div>
  )
}

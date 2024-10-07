import React, { Fragment, useMemo } from 'react'

import { Rect, RectProps } from './Rect'
import { SVGProps } from './SVG'

export interface LegendProps extends RectProps {
  panelColors: SVGProps['panelColors']
  rectSize: SVGProps['rectSize']
  leftPad: number
  rectY: number
  legendCellSize: number
  legendRender?: (props: RectProps) => React.ReactElement
  topPad: number
  space: number
}
export default function Legend({
  panelColors,
  leftPad = 0,
  topPad = 0,
  rectY = 15,
  space = 0,
  rectSize = 0,
  legendCellSize = 0,
  legendRender,
  ...props
}: LegendProps) {
  const size = legendCellSize || rectSize
  return useMemo(
    () => (
      <Fragment>
        {Object.keys(panelColors || {}).map((num, idx) => {
          const rectProps = {
            ...props,
            x: (size + 1) * idx + space * idx,
            fill: panelColors?.[Number(num)] || '',
            width: size,
            height: size,
          }
          if (legendRender) {
            return legendRender(rectProps)
          }
          return <Rect {...rectProps} key={idx} rx={3} />
        })}
      </Fragment>
    ),
    [panelColors, props, size, space, legendRender]
  )
}

import { CSSProperties } from 'react'
import React from 'react'

import { HeatMapValue } from '@mazic/shared'

import { SVGProps } from './SVG'

export const rectStyle: CSSProperties = {
  display: 'block',
  cursor: 'pointer',
}

export interface RectProps extends React.SVGProps<SVGRectElement> {
  value?: HeatMapValue
  render?: SVGProps['rectRender']
}

export const Rect = (props: RectProps) => {
  const { style, value, render, ...reset } = props
  const rectProps: React.SVGProps<SVGRectElement> = {
    ...reset,
    style: {
      display: 'block',
      cursor: 'pointer',
      ...style,
    },
  }

  if (render && typeof render === 'function') {
    const elm = render({ ...rectProps }, value as Required<RectProps>['value'])
    if (elm && React.isValidElement(elm)) {
      return elm
    }
  }

  return <rect {...rectProps} />
}

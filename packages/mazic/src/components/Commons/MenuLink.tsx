import { forwardRef, LegacyRef } from 'react'
import { Link, LinkProps } from 'react-router-dom'

import { findMenuByHref } from '@mazic/hooks'
import { useStore } from '@mazic/store/useStore'

export const MenuLink = forwardRef(
  ({ to, children, ...restProps }: LinkProps, ref?: LegacyRef<HTMLAnchorElement>) => {
    const { setOpenItem } = useStore().sidebar

    const onClick = () => {
      const menu = findMenuByHref(to)
      if (menu) {
        setOpenItem(menu)
      }
    }

    return (
      <Link {...restProps} to={to} onClick={onClick} ref={ref}>
        {children}
      </Link>
    )
  }
)

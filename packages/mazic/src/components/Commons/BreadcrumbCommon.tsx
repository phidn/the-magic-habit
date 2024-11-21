import { Fragment } from 'react'
import { Link, matchPath, useLocation } from 'react-router-dom'

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@mazic/ui'
import { NavItem } from '@mazic/types'

export const BreadcrumbCommon = () => {
  const { pathname } = useLocation()
  // const breadcrumbs = findBreadcrumb(pathname, NAV_ITEMS) || []
  const breadcrumbs = findBreadcrumb(pathname, []) || []

  if (breadcrumbs.length === 0) {
    return <div></div>
  }

  return (
    <Breadcrumb className="hidden md:flex">
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link to="/#">CRM</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        {breadcrumbs.map((breadcrumb, index) => {
          const isLast = index === breadcrumbs.length - 1
          const BreadcrumbComponent = isLast ? BreadcrumbPage : BreadcrumbItem
          return (
            <Fragment key={index}>
              <BreadcrumbSeparator />
              <BreadcrumbComponent key={index}>
                <BreadcrumbLink asChild>
                  <Link to={`/${breadcrumb}`}>{breadcrumb}</Link>
                </BreadcrumbLink>
              </BreadcrumbComponent>
            </Fragment>
          )
        })}
      </BreadcrumbList>
    </Breadcrumb>
  )
}

const findBreadcrumb = (
  pathname: string,
  navItems: NavItem[],
  result: string[] = []
): string[] | undefined => {
  for (let i = 0; i < navItems.length; i++) {
    const item = navItems[i]
    const currentBreadcrumb = [...result, item.title]
    const isMatch = matchPath(item.href, pathname)

    if (isMatch) {
      return currentBreadcrumb
    }

    if (item.childItems) {
      const foundBreadcrumb = findBreadcrumb(pathname, item.childItems, currentBreadcrumb)
      if (foundBreadcrumb) {
        return foundBreadcrumb
      }
    }
  }
}

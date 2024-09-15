import { Row } from '@tanstack/react-table'

import { ChevronDown, ChevronRightIcon } from '@mazic-design-system'

import { cn } from '@mazic/utils/cn'

interface IExpandingColumnProps<T = any> {
  row: Row<T>
  rowKey: string
}

export const ExpandingColumn = ({ row, rowKey }: IExpandingColumnProps) => {
  const depth = row.depth
  const isHasParent = !!depth
  const isExpanded = row.getIsExpanded()
  const isHasChildren = row.getCanExpand()

  return (
    <div
      className={cn(
        'ml-4',
        isHasParent && isHasChildren && depth === 1 && 'ml-4',
        isHasParent && !isHasChildren && depth === 1 && 'pl-4',
        isHasParent && isHasChildren && depth === 2 && 'ml-10',
        isHasParent && !isHasChildren && depth === 2 && 'pl-10',
        isHasParent && isHasChildren && depth === 3 && 'ml-14',
        isHasParent && !isHasChildren && depth === 3 && 'pl-14'
      )}
    >
      {isHasChildren && (
        <button
          onClick={row.getToggleExpandedHandler()}
          className="cursor-pointer mr-1 -ml-4"
          type="button"
        >
          {isExpanded ? <ChevronDown /> : <ChevronRightIcon />}
        </button>
      )}
      {row.getValue(rowKey)}
    </div>
  )
}

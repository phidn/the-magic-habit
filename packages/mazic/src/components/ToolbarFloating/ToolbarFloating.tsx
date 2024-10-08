import { useEffect } from 'react'
import { Cross2Icon, ReloadIcon } from '@radix-ui/react-icons'
import { Table } from '@tanstack/react-table'

import {
  Button,
  Kbd,
  Separator,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@mazic/ui'

type BulkAction = {
  icon: React.ReactNode
  label: string
  onClick: () => void
  loading?: boolean
}

interface ToolbarFloatingProps {
  table: Table<any>
  bulkActions?: BulkAction[] | BulkAction
}

export const ToolbarFloating = ({ table, bulkActions }: ToolbarFloatingProps) => {
  const selectedIds = Object.keys(table.getState().rowSelection)
  const bulkActionList = ([] as BulkAction[]).concat(bulkActions ?? []).filter(Boolean)

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        table.resetRowSelection()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [table])

  if (!selectedIds.length) return null

  return (
    <div className="fixed inset-x-0 bottom-20 z-50 mx-auto w-fit">
      <div className="w-full overflow-x-auto px-4">
        <div className="mx-auto flex w-fit items-center gap-2 rounded-md border bg-card p-2">
          <div className="flex h-7 items-center pl-2.5 pr-1">
            <span className="whitespace-nowrap text-xs mr-2">
              Selected <b>{selectedIds.length}</b> records
            </span>
            <TooltipProvider delayDuration={300}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-5 hover:border"
                    onClick={() => table.resetRowSelection()}
                  >
                    <Cross2Icon className="size-3.5 shrink-0" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent className="flex items-center border bg-accent px-2 py-1 font-semibold text-foreground dark:bg-zinc-900">
                  <p className="mr-2">Clear selection</p>
                  <Kbd abbrTitle="Escape" variant="outline">
                    Esc
                  </Kbd>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <Separator orientation="vertical" className="hidden h-5 sm:block" />
          <div className="flex items-center gap-1.5">
            {bulkActionList.map((action: BulkAction, idx) => {
              return (
                <Tooltip delayDuration={250} key={idx}>
                  <TooltipTrigger asChild>
                    <Button
                      variant="secondary"
                      size="icon"
                      className="size-7 border"
                      onClick={action.onClick}
                      disabled={action.loading}
                    >
                      {action.loading && <ReloadIcon className="size-3.5 animate-spin" />}
                      {!action.loading && action.icon}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent className="border bg-accent font-semibold text-foreground dark:bg-zinc-900">
                    <p>Delete tasks</p>
                  </TooltipContent>
                </Tooltip>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

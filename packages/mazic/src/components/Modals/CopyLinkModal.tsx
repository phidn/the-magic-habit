import { useEffect } from 'react'

import { Button, CopyIcon, Input, Label } from '@mazic/ui'

import { useCopy } from '@mazic/hooks'

interface Props {
  link: string
}

export const CopyLinkModal = ({ link }: Props) => {
  const copy = useCopy()

  useEffect(() => {
    copy(link)
  }, [copy, link])

  return (
    <div className="mazic-row items-center pr-4">
      <div className="mazic-col-11">
        <Label htmlFor="link" className="sr-only">
          Link
        </Label>
        <Input id="link" defaultValue={link} readOnly />
      </div>
      <div className="mazic-col-1">
        <Button size="sm" onClick={() => copy(link)}>
          <span className="sr-only">Copy</span>
          <CopyIcon className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}

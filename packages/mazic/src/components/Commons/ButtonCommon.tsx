import { Button, ButtonLink, PlusIcon } from '@mazic/design-system'

interface ButtonLinksProps {
  href?: string
  title?: string
}

interface ButtonsProps {
  onClick: () => void
  title?: string
}

export const ButtonLinksCommon = {
  Add: ({ href, title, ...restProps }: ButtonLinksProps) => (
    <ButtonLink href={href || '/#'} className="h-8 px-2 lg:px-3 mr-2" {...restProps}>
      <PlusIcon className="mr-2 h-4 w-4" />
      {title || 'Add new'}
    </ButtonLink>
  ),
}

export const ButtonsCommon = {
  Add: ({ onClick, title, ...restProps }: ButtonsProps) => (
    <Button
      onClick={(e) => {
        e?.preventDefault()
        onClick()
      }}
      className="h-8 px-2 lg:px-3 mr-2"
      {...restProps}
    >
      <PlusIcon className="mr-2 h-4 w-4" />
      {title || 'Add new'}
    </Button>
  ),
}

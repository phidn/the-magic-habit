import { Checkbox } from '@mazic/ui'

import { scrollTo } from '@mazic/utils/utils'

interface CheckBoxLabelProps {
  id: string | number
  title: string
  checked: boolean
}

export const CheckBoxLabel = ({ id, title, checked }: CheckBoxLabelProps) => {
  const _id = id.toString()

  return (
    <div className="flex items-center space-x-2 mb-2">
      <Checkbox id={_id} checked={checked} />
      <div className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
        <a href={`#${_id}`} onClick={(e) => handleScroll(e, _id)}>
          {title}
        </a>
      </div>
    </div>
  )
}

const handleScroll = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>, id: string) => {
  e?.preventDefault()
  scrollTo(`#${id}`)
}

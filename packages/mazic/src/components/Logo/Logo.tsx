import { ShadcnIcon } from '@mazic/design-system'

interface LogoProps {
  hideText?: boolean
  hideIcon?: boolean
}

const Logo = (props: LogoProps) => {
  const { hideText = false, hideIcon = false } = props
  return (
    <div className="flex items-center h-8">
      {!hideIcon && (
        <div>
          <ShadcnIcon className="mx-auto h-8 w-8 mr-1" />
        </div>
      )}
      {!hideText && <span className="hidden font-bold sm:inline-block">mazic</span>}
    </div>
  )
}

export default Logo

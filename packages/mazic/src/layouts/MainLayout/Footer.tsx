import Logo from '@mazic/components/Logo/Logo'

export const Footer = () => {
  return (
    <div className="z-20 w-full bg-background/95 shadow backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-4 md:mx-8">
        <div className="h-14 px-4 flex flex-col items-center justify-between sm:flex-row">
          <p className="text-sm">Copyright © 2024 Mazic</p>
          <Logo hideText />
        </div>
      </div>
    </div>
  )
}

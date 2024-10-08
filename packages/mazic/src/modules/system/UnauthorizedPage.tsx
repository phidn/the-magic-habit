import { ButtonLink, Unauthorized } from '@mazic/ui'

const UnauthorizedPage = () => {
  return (
    <div>
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <figure className="m-auto w-full">
            <Unauthorized />
          </figure>
          <div className="mt-8 space-y-4 lg:mt-14">
            <h1 className="text-3xl font-bold tracking-tight lg:text-5xl">No authorization</h1>
            <p className="text-muted-foreground">
              You do not appear to have permission to access this page
            </p>
          </div>
          <div className="mt-8">
            <ButtonLink href="/">Go to home</ButtonLink>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UnauthorizedPage

import { ButtonLink } from '@mazic/ui'
import { pathRoutes } from '@mazic/config/pathRoutes'

import { HeroCards } from './HeroCards'

export const Hero = () => {
  return (
    <section className="container grid lg:grid-cols-2 place-items-center py-20 md:py-32 gap-10">
      <div className="text-center lg:text-start space-y-6">
        <main className="text-5xl md:text-6xl font-bold">
          <h1 className="inline">
            <span className="inline bg-gradient-to-r from-[#F596D3]  to-[#D247BF] text-transparent bg-clip-text">
              The Magic Habit
            </span>{' '}
          </h1>{' '}
          <br />
          Make it for{' '}
          <h2 className="inline">
            <span className="inline bg-gradient-to-r from-[#61DAFB] via-[#1fc0f1] to-[#03a3d7] text-transparent bg-clip-text">
              so e.z
            </span>{' '}
            you can't say no
          </h2>
        </main>

        <p className="text-xl text-muted-foreground md:w-10/12 mx-auto lg:mx-0">
          Build your habits effortlessly with simple steps that make progress a natural part of your
          day.
        </p>

        <div className="space-y-4 md:space-y-0 md:space-x-4">
          <ButtonLink href={pathRoutes.auth.login} className="w-full md:w-1/3">
            Get Started
          </ButtonLink>
        </div>
      </div>

      {/* Hero cards sections */}
      <div className="z-10">
        <HeroCards />
      </div>

      {/* Shadow effect */}
      <div className="shadow"></div>
    </section>
  )
}

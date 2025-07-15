import { About } from './components/About'
import { Hero } from './components/Hero'
import { HeroFeatures } from './components/HeroFeatures'
import Leaderboard from './components/Leaderboard/Leaderboard'
import { Navbar } from './components/Navbar'
import { Pricing } from './components/Pricing'
import { ScrollToTop } from './components/ScrollToTop'

const HomePage = () => {
  return (
    <div>
      <Navbar />
      <Leaderboard />
      <HeroFeatures />
      <Hero />
      <About />
      <Pricing />
      <ScrollToTop />
    </div>
  )
}

export default HomePage

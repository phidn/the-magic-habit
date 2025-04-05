import { About } from './components/About'
import { Hero } from './components/Hero'
import RaceLeaderboard from './components/Leaderboard/RaceLeaderboard'
import { Navbar } from './components/Navbar'
import { Pricing } from './components/Pricing'
import { ScrollToTop } from './components/ScrollToTop'

const HomePage = () => {
  return (
    <div>
      <Navbar />
      <RaceLeaderboard />
      <Hero />
      <About />
      <Pricing />
      <ScrollToTop />
    </div>
  )
}

export default HomePage

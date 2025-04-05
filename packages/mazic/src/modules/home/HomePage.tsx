import { About } from './components/About'
import { Hero } from './components/Hero'
import Leaderboard from './components/Leaderboard/Leaderboard'
import { Navbar } from './components/Navbar'
import { Pricing } from './components/Pricing'
import { ScrollToTop } from './components/ScrollToTop'

const HomePage = () => {
  return (
    <div>
      <Navbar />
      <Leaderboard />
      <Hero />
      <About />
      <Pricing />
      <ScrollToTop />
    </div>
  )
}

export default HomePage

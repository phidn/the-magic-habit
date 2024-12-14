import { About } from './components/About'
import { Hero } from './components/Hero'
import { Navbar } from './components/Navbar'
import { Pricing } from './components/Pricing'
import { ScrollToTop } from './components/ScrollToTop'

const HomePage = () => {
  return (
    <div>
      <Navbar />
      <Hero />
      <About />
      <Pricing />
      <ScrollToTop />
    </div>
  )
}

export default HomePage

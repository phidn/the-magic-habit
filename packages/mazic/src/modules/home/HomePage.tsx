import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import { LoadingTop } from '@mazic/components'
import { useStore } from '@mazic/store/useStore'

import { About } from './components/About'
import { Hero } from './components/Hero'
import { Navbar } from './components/Navbar'
import { Pricing } from './components/Pricing'
import { ScrollToTop } from './components/ScrollToTop'

const HomePage = () => {
  const navigate = useNavigate()
  const isLogged = useStore((store) => store.currentUser.user)

  useEffect(() => {
    if (isLogged) {
      navigate('/dashboard')
    }
  }, [navigate, isLogged])

  if (isLogged === undefined) {
    return <LoadingTop />
  }

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

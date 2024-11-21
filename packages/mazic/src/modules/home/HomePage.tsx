import { About } from './components/About'
import { Hero } from './components/Hero'
import { Navbar } from './components/Navbar'
import { Pricing } from './components/Pricing'
import { ScrollToTop } from './components/ScrollToTop'

const HomePage = () => {
  // const navigate = useNavigate()
  // const { user, loaded } = useStore((store) => store.currentUser)

  // useEffect(() => {
  //   if (user && loaded) {
  //     navigate(pathRoutes.dashboard)
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [user, loaded])

  // if (!loaded) {
  //   return <LoadingTop />
  // }

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

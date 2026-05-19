import ReviewsSection from '../components/ReviewsSection'
import Hero from '../components/Hero'
import Categories from '../components/Categories'
import FeaturedProducts from '../components/FeaturedProducts'
import Benefits from '../components/Benefits'
import Gallery from '../components/Gallery'
import Story from '../components/Story'

export default function HomePage() {
  return (
    <>
      <Hero />
      <Categories />
      <FeaturedProducts />
      <Benefits />
      <Story />
      <ReviewsSection />
      <Gallery />
    </>
  )
}

import { ForestCanvas } from '@/components/forest/forest-canvas'
import { Booking } from '@/components/site/booking'
import { Footer } from '@/components/site/footer'
import { Guide } from '@/components/site/guide'
import { Header } from '@/components/site/header'
import { Hero } from '@/components/site/hero'
import { Method } from '@/components/site/method'
import { Refuge } from '@/components/site/refuge'
import { Trails } from '@/components/site/trails'

export default function Home() {
  return (
    <>
      <ForestCanvas />
      <Header />
      <main className="relative z-10">
        <Hero />
        <Method />
        <Trails />
        <Guide />
        <Refuge />
        <Booking />
      </main>
      <div className="relative z-10">
        <Footer />
      </div>
    </>
  )
}

import Hero from './components/Hero'
import HowItWorks from './components/HowItWorks'
import PillsLibrary from './components/PillsLibrary'
import DemoSection from './components/DemoSection'
import Footer from './components/Footer'

export default function App() {
  return (
    <main className="min-h-screen bg-dark text-white">
      <Hero />
      <HowItWorks />
      <PillsLibrary />
      <DemoSection />
      <Footer />
    </main>
  )
}

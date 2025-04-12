import NavBar from "@/components/nav-bar"
import HeroSection from "@/components/hero-section"
import FeedbackForm from "@/components/feedback-form"
import AnimatedBackground from "@/components/animated-background"

export default function Home() {
  return (
    <main className="min-h-screen bg-white relative overflow-hidden">
      <AnimatedBackground />
      <div className="relative z-10">
        <NavBar />
        <div className="container mx-auto px-4 max-w-3xl">
          <HeroSection />
          <FeedbackForm />
        </div>
      </div>
    </main>
  )
}

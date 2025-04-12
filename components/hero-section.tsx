import { Button } from "@/components/ui/button"

export default function HeroSection() {
  return (
    <section className="py-6 md:py-8 text-center">
      <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 tracking-tight mb-6">
        Your Feedback is our greatest source of income.
      </h1>
      <Button className="rounded-full px-5 py-6 bg-white text-black border border-gray-200 hover:bg-gray-50 shadow-sm transition-all duration-300 hover:shadow-md">
        <span>Explore HCX Resort</span>
        <span className="ml-2 transition-transform duration-300 group-hover:translate-x-1">→</span>
      </Button>
    </section>
  )
}

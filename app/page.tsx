import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#0A0F1A] text-white">
      {/* Hero Section */}
      <div className="relative h-screen">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#0A0F1A] z-10"></div>
        <div className="absolute inset-0 bg-[url('/hero-bg.jpg')] bg-cover bg-center opacity-20"></div>
        <div className="container mx-auto px-4 h-full flex flex-col justify-center items-center relative z-20">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 text-center">
            Track Your Fitness Journey
          </h1>
          <p className="text-xl text-gray-300 mb-10 max-w-2xl text-center">
            FitTrack helps you monitor your workouts, nutrition, and progress all in one place.
            Achieve your fitness goals with our comprehensive tracking tools.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/signup">
              <Button className="bg-green-500 hover:bg-green-600 text-white px-8 py-6 text-lg">
                Get Started
              </Button>
            </Link>
            <Link href="/login">
              <Button variant="outline" className="px-8 py-6 text-lg">
                Log In
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

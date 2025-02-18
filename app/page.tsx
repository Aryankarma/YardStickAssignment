import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-blue-100 to-white">
      <h1 className="text-4xl font-bold mb-6 text-center">Personal Finance Visualizer</h1>
      <p className="text-xl mb-8 text-center max-w-2xl">
        Track your expenses, visualize your spending habits, and take control of your financial future.
      </p>
      <Link href="/dashboard">
        <Button size="lg">Get Started</Button>
      </Link>
    </div>
  )
}


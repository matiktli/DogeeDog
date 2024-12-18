import PricingCard from '@/app/components/PricingCard'

export const metadata = {
  title: 'Pricing - DogeeDog',
  description: 'Transform your daily dog walks with our premium features. Start your free trial today!',
}

export default function PricingPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8">
      <PricingCard />
    </main>
  )
} 
/**
 * @file Landing / home page
 * @module routes/marketing/Landing
 * @description Public landing page with hero section, feature highlights, and
 *   a how-it-works guide. Entry point for unauthenticated users.
 */

// Helmet for setting page title/meta tags
import { Helmet } from 'react-helmet-async';

// Lucide icons for feature cards
import { Train, Shield, Clock, CreditCard } from 'lucide-react';

// Main trip search form component
import { TripSearchForm } from '@/components/trips/TripSearchForm';

// Scroll-triggered animation wrapper
import { AnimationContainer } from '@/components/marketing/animations/AnimationContainer';

// Scroll-down mouse indicator animation
import { ScrollMouseIndicator } from '@/components/marketing/animations/ScrollMouseIndicator';

const features = [
  { icon: Train, title: 'Real-time Availability', description: 'Check seat availability across all classes instantly.' },
  { icon: Shield, title: 'Secure Booking', description: 'Verified agents book at station counters for you.' },
  { icon: Clock, title: 'Tatkal Booking', description: 'Get your Tatkal tickets booked without the rush.' },
  { icon: CreditCard, title: 'Easy Payments', description: 'UPI, cards, net banking — pay the way you want.' },
];

const steps = [
  { number: '01', title: 'Search', description: 'Enter source, destination, and date to find trains.' },
  { number: '02', title: 'Select', description: 'Choose your train, class, and preferred seats.' },
  { number: '03', title: 'Book', description: 'Enter passenger details, pay, and get your ticket.' },
];

/**
 * Landing (page component)
 * @description Renders the public landing/home page with a hero section
 *   containing the trip search form, feature highlights (real-time availability,
 *   secure booking, Tatkal, payments), and a three-step how-it-works guide.
 */
export default function Landing() {
  return (
    <>
      <Helmet>
        <title>TripTatkal — Book Train Tickets, Anytime</title>
        <meta name="description" content="Search trains, book tickets, and track your journey with TripTatkal." />
      </Helmet>

      {/* Hero Section */}
      <section className="relative overflow-hidden border-b bg-gradient-to-b from-background to-muted/30">
        <div className="mx-auto max-w-6xl px-4 py-20 text-center lg:py-28">
          <AnimationContainer variant="fadeInUp">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              Book Train Tickets
              <span className="block text-primary">In Minutes</span>
            </h1>
          </AnimationContainer>
          <AnimationContainer variant="fadeInUp" delay={0.15}>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
              Search trains, check real-time availability, and book tickets with ease.
              Our agents help with Tatkal and counter bookings.
            </p>
          </AnimationContainer>
          <AnimationContainer variant="fadeInUp" delay={0.3}>
            <div className="mx-auto mt-10 max-w-4xl rounded-xl border bg-card p-6 shadow-sm">
              <TripSearchForm />
            </div>
          </AnimationContainer>
        </div>
        <ScrollMouseIndicator />
      </section>

      {/* Features Section */}
      <section className="border-b py-20">
        <div className="mx-auto max-w-6xl px-4">
          <AnimationContainer variant="fadeInUp" className="text-center">
            <h2 className="text-3xl font-bold">Why TripTatkal?</h2>
            <p className="mt-2 text-muted-foreground">Everything you need for stress-free train booking</p>
          </AnimationContainer>
          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((f, i) => (
              <AnimationContainer key={f.title} variant="fadeInUp" delay={0.1 * i}>
                <div className="rounded-lg border bg-card p-6 text-center">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                    <f.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="mt-4 font-semibold">{f.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{f.description}</p>
                </div>
              </AnimationContainer>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20">
        <div className="mx-auto max-w-6xl px-4">
          <AnimationContainer variant="fadeInUp" className="text-center">
            <h2 className="text-3xl font-bold">How It Works</h2>
            <p className="mt-2 text-muted-foreground">Book your train ticket in three simple steps</p>
          </AnimationContainer>
          <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-3">
            {steps.map((s, i) => (
              <AnimationContainer key={s.number} variant="fadeInUp" delay={0.15 * i}>
                <div className="text-center">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary text-2xl font-bold text-primary-foreground">
                    {s.number}
                  </div>
                  <h3 className="mt-4 text-xl font-semibold">{s.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{s.description}</p>
                </div>
              </AnimationContainer>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

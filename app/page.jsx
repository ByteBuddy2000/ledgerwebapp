import { Navbar } from '@/components/navbar'
import { HeroSection } from '@/components/hero-section'
import { FeaturesSection } from '@/components/features-section'
import { CTASection } from '@/components/cta-section'
import { Banner } from '@/components/banner'
import { QFSCardSection } from '@/components/qfs-card-section'
import { QFSAboutSection } from '@/components/qfs-about-section'
import { FlareNetworkSection } from '@/components/flare-network-section'
import { HowItWorksSection } from '@/components/how-it-works-section'
import { VideoArea } from '@/components/video-area'
import { CounterSection } from '@/components/counter-section'
import { TestimonialsSection } from '@/components/testimonials-section'
import { RecentNewsSection } from '@/components/recent-news-section'
import { FaqSection } from '@/components/faq-section'
import { TouchSection } from '@/components/touch-section'
import { FooterSection } from '@/components/footer-section'
import InvestWithoutGuesswork from '@/components/guesswork'

export default function Page() {
  return (
    <>
      <main className="min-h-screen bg-background">
         <Navbar />
        <HeroSection />
        <Banner />
        <FeaturesSection />
        <QFSCardSection />
        <QFSAboutSection />
        <VideoArea />
        <FlareNetworkSection />
        <HowItWorksSection />
        <CounterSection />
        <TestimonialsSection />
        <RecentNewsSection />
        <FaqSection />
        <TouchSection />
        <CTASection />
        <InvestWithoutGuesswork/>


      </main>
      <FooterSection />
    </>
  )
}

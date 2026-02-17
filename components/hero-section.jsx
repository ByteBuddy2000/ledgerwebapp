'use client'

import { ArrowRight } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'

const blockchains = [
  { name: 'Bitcoin', logo: '/cryptocoin/bitcoin.svg' },
  { name: 'Ethereum', logo: '/cryptocoin/ethereum.svg' },
  { name: 'Solana', logo: '/cryptocoin/solana.png' },
  { name: 'BNB Chain', logo: '/cryptocoin/binancecoin.svg' },
  { name: 'Tron', logo: '/cryptocoin/tron.svg' },
  { name: 'Stellar', logo: '/cryptocoin/stellar.png' },
]



export function HeroSection() {
  const dashboardRef = useRef(null)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    let animationFrame

    const handleScroll = () => {
      if (!dashboardRef.current) return

      const rect = dashboardRef.current.getBoundingClientRect()
      const windowHeight = window.innerHeight

      const visible = 1 - rect.top / windowHeight
      const clamped = Math.min(Math.max(visible, 0), 1)

      animationFrame = requestAnimationFrame(() => {
        setProgress(clamped)
      })
    }

    window.addEventListener('scroll', handleScroll)
    handleScroll()

    return () => {
      window.removeEventListener('scroll', handleScroll)
      cancelAnimationFrame(animationFrame)
    }
  }, [])

  return (
    <section
      id="hero"
      className="relative flex flex-col items-center 
             pt-24 sm:pt-28 lg:pt-32 
             pb-12 sm:pb-16 
             overflow-hidden"
    >

      {/* ===== Background ===== */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 right-1/4 w-64 h-64 sm:w-96 sm:h-96 bg-primary/20 rounded-full blur-3xl opacity-30 animate-pulse"></div>
        <div className="absolute bottom-20 left-1/4 w-48 h-48 sm:w-72 sm:h-72 bg-primary/10 rounded-full blur-3xl opacity-20"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/5"></div>
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center w-full">

        {/* ===== Heading ===== */}
        <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold tracking-tight mb-6 leading-tight text-balance">
          Take control of your <span className="text-primary">crypto</span> investments
        </h1>

        {/* ===== Subheading ===== */}
        <p className="text-lg sm:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed text-balance">
          Your assets, streamlined. Trump IRS Vault delivers instant transactions,
          low fees, and next-level security.
        </p>

        {/* ===== CTA ===== */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20">
          <Link href="/login">
            <button className="group px-8 py-3 rounded-full bg-primary text-primary-foreground font-semibold text-base hover:opacity-90 transition flex items-center gap-2 shadow-lg shadow-primary/25">
              Start for free
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
            </button>
          </Link>
        </div>

        {/* =========================================== */}
        {/* 🔥 Seamless Premium Blockchain Marquee 🔥 */}
        {/* =========================================== */}

        <div className="space-y-8 mb-6 sm:mb-10">


          <p className="text-sm font-semibold tracking-[0.25em] text-muted-foreground uppercase">
            Supported Networks
          </p>

          <div className="relative overflow-hidden py-8">

            <style>{`
      @keyframes smooth-scroll {
        0% { transform: translateX(0); }
        100% { transform: translateX(-50%); }
      }
    `}</style>

            {/* Marquee Track */}
            <div
              className="flex items-center gap-20 will-change-transform hover:[animation-play-state:paused]"
              style={{
                width: 'fit-content',
                animation: 'smooth-scroll 40s linear infinite',
              }}
            >
              {[...blockchains, ...blockchains].map((chain, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-4 group cursor-pointer opacity-80 hover:opacity-100 transition-all duration-300"
                >
                  {/* Logo */}
                  <div className="relative w-8 h-8 sm:w-9 sm:h-9 transition-transform duration-300 group-hover:scale-110">
                    <Image
                      src={chain.logo}
                      alt={chain.name}
                      fill
                      className="object-contain"
                    />
                  </div>

                  {/* Name */}
                  <span className="text-base sm:text-lg font-medium text-foreground/80 group-hover:text-foreground transition-colors duration-300 tracking-wide whitespace-nowrap">
                    {chain.name}
                  </span>
                </div>
              ))}
            </div>



          </div>
        </div>



      </div>
    </section>
  )
}

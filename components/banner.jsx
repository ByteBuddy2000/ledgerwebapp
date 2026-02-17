'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'

const slides = [
  {
    title: 'Trump IRS Vault System',
    description:
      'Trump IRS Vault System gives immunity against cyber attacks and bad market fluctuations.',
    image: '/trump2.jpg',
  },
  {
    title: 'Next-Gen Asset Security',
    description:
      'TIV gives your asset the protection it deserves. Never miss this opportunity.',
    image: '/next-gen.jpg',
  },
]

export function Banner() {
  const [current, setCurrent] = useState(0)
  const [autoplay, setAutoplay] = useState(true)

  useEffect(() => {
    if (!autoplay) return
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [autoplay])

  return (
    <section className="relative w-full min-h-screen overflow-hidden">

      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Background */}
          <div
            className="absolute inset-0 scale-105"
            style={{
              backgroundImage: `url(${slides[current].image})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          />

          {/* Smooth Overlay (Less Harsh) */}
          <div className="absolute inset-0 bg-black/50" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />

          {/* Content */}
          <div className="relative z-10 flex items-center h-full px-6 sm:px-12 lg:px-20">
            <motion.div
              className="max-w-2xl"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                {slides[current].title}
              </h1>

              <p className="text-lg sm:text-xl text-gray-200 mb-8">
                {slides[current].description}
              </p>

              <div className="flex flex-wrap gap-4">
                <Link href="/login">
                  <button className="px-8 py-3 rounded-full bg-primary text-primary-foreground font-semibold hover:scale-105 transition-all duration-300 shadow-lg">
                    Get Started
                  </button>
                </Link>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Dots */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex gap-3">
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => {
              setCurrent(idx)
              setAutoplay(false)
            }}
            className={`h-2 rounded-full transition-all duration-300 ${
              idx === current
                ? 'bg-primary w-8'
                : 'bg-white/40 w-2 hover:bg-white/60'
            }`}
          />
        ))}
      </div>
    </section>
  )
}

'use client'

import { useEffect, useState, useRef } from 'react'
import { motion, useInView } from 'framer-motion'

const testimonials = [
  {
    text: 'Trump IRS Vault has transformed how I manage my portfolio. The security features give me complete peace of mind.',
    name: 'Charlotte',
    location: 'England',
  },
  {
    text: 'This platform is a game-changer. It feels like having a personal vault for all my digital assets.',
    name: 'Luck',
    location: 'United States',
  },
  {
    text: 'Je recommande vivement Trump IRS Vault. Sûr, rapide et fiable — l\'avenir de la finance numérique.',
    name: 'Elise',
    location: 'France',
  },
]

const duplicated = [...testimonials, ...testimonials]
const CARD_WIDTH = 360
const GAP = 24
const SLIDE_WIDTH = CARD_WIDTH + GAP

export function TestimonialsSection() {
  const [index, setIndex] = useState(0)
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '0px 0px -120px 0px' })

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % testimonials.length)
    }, 6000)
    return () => clearInterval(interval)
  }, [])

  return (
    <section ref={ref} className="relative w-full py-24 overflow-hidden bg-background">
      {/* Background effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-96 h-96 bg-primary/10 rounded-full blur-3xl opacity-30"></div>
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-primary/5 rounded-full blur-3xl opacity-20"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.h2
          className="text-3xl sm:text-4xl lg:text-5xl font-bold text-balance mb-16"
          initial={{ opacity: 0, y: 60 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9, ease: 'easeOut' }}
        >
          Trusted by Thousands of Users
        </motion.h2>

        <motion.div
          className="overflow-hidden w-full"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 1.1, delay: 0.2 }}
        >
          <motion.div
            className="flex gap-6"
            style={{
              transform: `translateX(-${index * SLIDE_WIDTH}px)`,
              transition: 'transform 0.9s ease-in-out',
              width: `${duplicated.length * SLIDE_WIDTH}px`,
            }}
          >
            {duplicated.map((testimonial, i) => (
              <div
                key={i}
                className="min-w-[360px] max-w-[360px] bg-card border border-border rounded-2xl p-8 backdrop-blur-sm hover:border-primary/50 transition"
              >
                {/* Quote Mark */}
                <div className="text-4xl text-primary font-serif mb-4">"</div>

                <p className="mb-6 text-muted-foreground leading-relaxed italic">
                  {testimonial.text}
                </p>

                <div className="h-px bg-gradient-to-r from-primary/30 via-transparent to-primary/30 mb-5" />

                <div>
                  <h4 className="text-sm font-semibold text-foreground">{testimonial.name}</h4>
                  <span className="text-xs text-muted-foreground">{testimonial.location}</span>
                </div>
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* Navigation Dots */}
        <div className="flex justify-center gap-2 mt-12">
          {testimonials.map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              className={`transition-all h-2 rounded-full ${
                index === i ? 'bg-primary w-8' : 'bg-border w-2 hover:bg-border/80'
              }`}
              aria-label={`Go to testimonial ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

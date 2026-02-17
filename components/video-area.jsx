'use client'

import { motion } from 'framer-motion'
import { Play } from 'lucide-react'
import Link from 'next/link'

export function VideoArea() {
  return (
    <section className="w-full py-16 sm:py-20 lg:py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          className="text-center mb-12 sm:mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4 text-balance">
            Experience Innovation in <span className="text-primary">Real-Time</span>
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto text-balance leading-relaxed">
            Discover how the Trump IRS Vault System is transforming the digital economy through real-time performance, absolute security, and futuristic technologies.
          </p>
        </motion.div>

        {/* Video Container */}
        <motion.div
          className="relative rounded-2xl overflow-hidden border border-border/50 shadow-2xl bg-card"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, type: 'spring', stiffness: 100 }}
          viewport={{ once: true }}
        >
          {/* Background gradient effect */}
          <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 via-transparent to-primary/5 pointer-events-none"></div>

          {/* Video Frame */}
          <div className="relative w-full aspect-video bg-black">
            <iframe
              className="w-full h-full"
              src="https://www.youtube.com/embed/sFX1d7Si3mA?autoplay=1&mute=1&rel=0&modestbranding=1&controls=1&showinfo=0"
              title="QFS Intro Video"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            ></iframe>
          </div>
        </motion.div>

        {/* Bottom CTA Section */}
        <motion.div
          className="mt-12 sm:mt-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <p className="text-muted-foreground text-sm sm:text-base mb-6">
            Ready to start your journey with the Trump IRS Vault System?
          </p>
          <Link href="/login">
            <button className="inline-flex items-center gap-2 px-8 py-3 rounded-full bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-all duration-300 hover:scale-105">
              Get Started Now
              <motion.span
                animate={{ x: [0, 4, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                →
              </motion.span>
            </button>
          </Link>
        </motion.div>
      </div>
    </section>
  )
}

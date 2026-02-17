'use client'

import { ArrowRight } from 'lucide-react'
import Link from 'next/link'

export function CTASection() {
  return (
    <section className="py-16 sm:py-20 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-transparent to-primary/20 opacity-30"></div>
        </div>

        <div className="relative z-10 bg-gradient-to-br from-primary/30 to-primary/10 border border-primary/20 rounded-2xl sm:rounded-3xl p-8 sm:p-12 lg:p-16 text-center backdrop-blur-sm">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 text-balance">
            Ready to take control?
          </h2>
          <p className="text-base sm:text-lg lg:text-xl text-muted-foreground mb-6 sm:mb-8 max-w-2xl mx-auto text-balance">
            Join thousands of users who trust Trump IRS Vault for their crypto investments
          </p>
          <Link href="/login">
            <button className="group inline-flex items-center gap-2 px-6 sm:px-8 py-3 sm:py-4 rounded-full bg-primary text-primary-foreground font-semibold text-sm sm:text-lg hover:opacity-90 transition">
              Start for free
              <ArrowRight className="w-4 sm:w-5 h-4 sm:h-5 group-hover:translate-x-1 transition" />
            </button>
          </Link>
        </div>
      </div>
    </section>
  )
}

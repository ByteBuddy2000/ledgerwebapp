'use client'

import { motion } from 'framer-motion'
import { UserPlus, Link2, Landmark, ArrowRight } from 'lucide-react'

const steps = [
  {
    icon: UserPlus,
    title: 'Create Account',
    description: 'Sign up and complete identity verification to activate your QFS wallet.',
  },
  {
    icon: Link2,
    title: 'Sync Your Wallet',
    description: 'Link your digital assets and synchronize with the Trump IRS Vault System.',
  },
  {
    icon: Landmark,
    title: 'Access Services',
    description: 'Unlock global payments, trading, and exclusive quantum technology benefits.',
  },
]

export function HowItWorksSection() {
  return (
    <section className="relative py-20 sm:py-32 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl opacity-20"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl opacity-10"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4">How It Works</h2>
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
            The Trump IRS Vault System merges technology with digital finance to revolutionize trust, speed, and safety. Built to dismantle legacy corruption with real-time verification and total transparency.
          </p>
        </motion.div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {steps.map((step, idx) => {
            const Icon = step.icon
            return (
              <motion.div
                key={step.title}
                className="relative group"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur"></div>
                <div className="relative rounded-2xl border border-border bg-card/50 backdrop-blur-sm p-8 h-full group-hover:border-primary/50 transition-colors duration-300">
                  {/* Step Number */}
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-primary/20 mb-4 group-hover:bg-primary/30 transition">
                    <span className="text-lg font-bold text-primary">{idx + 1}</span>
                  </div>

                  <Icon className="w-8 h-8 text-primary mb-4" />

                  <h3 className="text-xl font-semibold text-foreground mb-2">{step.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{step.description}</p>

                  {/* Arrow to next step */}
                  {idx < steps.length - 1 && (
                    <div className="hidden md:block absolute -right-6 top-1/2 -translate-y-1/2">
                      <ArrowRight className="w-5 h-5 text-primary/40" />
                    </div>
                  )}
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Bottom CTA */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          viewport={{ once: true }}
        >
          <p className="text-lg text-muted-foreground mb-6">
            Ready to join the revolution in decentralized finance?
          </p>
          <button className="px-8 py-3 rounded-full bg-primary text-primary-foreground font-semibold hover:opacity-90 transition">
            Start Your TIV Journey
          </button>
        </motion.div>
      </div>
    </section>
  )
}

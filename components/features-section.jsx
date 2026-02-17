'use client'

import { Zap, Lock, TrendingUp, Globe, BarChart3, Wallet } from 'lucide-react'

export function FeaturesSection() {
  const features = [
    {
      icon: Zap,
      title: 'Instant Transactions',
      description: 'Lightning-fast crypto transfers and trades with minimal latency'
    },
    {
      icon: Lock,
      title: 'Next-Level Security',
      description: 'Enterprise-grade encryption and multi-factor authentication'
    },
    {
      icon: TrendingUp,
      title: 'Advanced Analytics',
      description: 'Real-time market data and portfolio performance tracking'
    },
    {
      icon: Globe,
      title: 'Global Access',
      description: 'Support for 30+ blockchain networks and major cryptocurrencies'
    },
    {
      icon: BarChart3,
      title: 'Low Fees',
      description: 'Industry-leading transaction fees without hidden charges'
    },
    {
      icon: Wallet,
      title: 'Smart Wallet',
      description: 'Unified dashboard for managing all your crypto assets'
    }
  ]

  return (
    <section className="py-16 sm:py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4 text-balance">
            Features designed for success
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
            Everything you need to manage and grow your crypto portfolio
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {features.map((feature) => {
            const Icon = feature.icon
            return (
              <div
                key={feature.title}
                className="group relative p-6 sm:p-8 rounded-xl bg-card border border-border hover:border-primary/50 transition duration-300"
              >
                {/* Hover gradient effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition rounded-xl"></div>

                <div className="relative z-10">
                  {/* Icon Container */}
                  <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center mb-4 group-hover:bg-primary/30 transition">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-semibold text-foreground mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useAnimation } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { Shield, Users, TrendingUp, Lock } from 'lucide-react'

const counters = [
  {
    icon: Shield,
    value: 869895,
    label: 'Secured Assets',
  },
  {
    icon: Users,
    value: 87762,
    label: 'Active Users',
  },
  {
    icon: TrendingUp,
    value: 170294,
    label: 'Transactions',
  },
  {
    icon: Lock,
    value: 887616,
    label: 'Registered Members',
  },
]

function useCountUp(end, duration = 2, start = false) {
  const [count, setCount] = useState(0)
  const frame = useRef()

  useEffect(() => {
    if (!start) return
    let startTime = null

    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp
      const progress = Math.min((timestamp - startTime) / (duration * 1000), 1)
      setCount(Math.floor(progress * end))
      if (progress < 1) {
        frame.current = requestAnimationFrame(animate)
      }
    }

    frame.current = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(frame.current)
  }, [end, duration, start])

  return count.toLocaleString()
}

export function CounterSection() {
  const controls = useAnimation()
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.3 })
  const [startCounting, setStartCounting] = useState(false)

  useEffect(() => {
    if (inView) {
      controls.start({ opacity: 1, y: 0 })
      setStartCounting(true)
    }
  }, [inView, controls])

  return (
    <section ref={ref} className="w-full py-24 relative overflow-hidden bg-background">
      {/* Background gradient */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {counters.map((counter, idx) => {
            const IconComponent = counter.icon
            const count = useCountUp(counter.value, 2.5, startCounting)
            return (
              <motion.div
                key={counter.label}
                className="flex flex-col items-center text-center p-8 rounded-xl bg-card border border-border hover:border-primary/50 transition"
                initial={{ opacity: 0, y: 40 }}
                animate={controls}
                transition={{ duration: 0.8, delay: idx * 0.15 }}
              >
                <div className="mb-4 p-3 rounded-full bg-primary/10">
                  <IconComponent className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-3xl font-bold text-foreground mb-2 select-none">
                  {count}
                </h3>
                <p className="text-sm text-muted-foreground font-medium">{counter.label}</p>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

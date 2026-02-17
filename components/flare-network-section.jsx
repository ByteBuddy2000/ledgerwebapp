'use client'

import { motion } from 'framer-motion'
import { Flame, ArrowRight } from 'lucide-react'

const videos = [
  {
    title: 'XRP End Game',
    ytTitle: '$10,000 Ripple XRP End Game',
    src: 'https://www.youtube.com/embed/sFX1d7Si3mA',
  },
  {
    title: 'Reserve Crypto Incoming',
    ytTitle: 'New World Reserve Cryptocurrency Incoming!',
    src: 'https://www.youtube.com/embed/yLeji6EidI8',
  },
  {
    title: 'Mark Philips Interview',
    ytTitle: 'Ripple XRP - XRP Army News Interview',
    src: 'https://www.youtube.com/embed/juUgJwBwgWk',
  },
]

export function FlareNetworkSection() {
  return (
    <section className="relative py-20 sm:py-32 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl opacity-30"></div>
        <div className="absolute bottom-0 left-1/3 w-96 h-96 bg-primary/5 rounded-full blur-3xl opacity-20"></div>
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
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">Flare Network</span> Integration
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
            Empowering smart contract functionality for assets like BTC, XRP, and more — Flare unlocks a new era of DeFi possibilities for retirement, wealth, and trustless finance.
          </p>
        </motion.div>

        {/* Video Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {videos.map((video, idx) => (
            <motion.div
              key={video.title}
              className="group relative rounded-2xl overflow-hidden border border-border bg-card/50 backdrop-blur-sm hover:border-primary/50 transition-all duration-300"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: idx * 0.1 }}
              viewport={{ once: true }}
            >
              <div className="aspect-video bg-gradient-to-br from-background to-card relative overflow-hidden">
                <iframe
                  src={video.src}
                  title={video.ytTitle}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full"
                />
              </div>
              <div className="p-4 bg-gradient-to-t from-background/80 to-transparent">
                <h3 className="text-lg font-semibold text-foreground mb-1 group-hover:text-primary transition">{video.title}</h3>
                <p className="text-sm text-muted-foreground">{video.ytTitle}</p>
              </div>
            </motion.div>
          ))}

          {/* CTA Card */}
          <motion.div
            className="relative rounded-2xl overflow-hidden border border-primary/30 bg-gradient-to-br from-primary/30 to-primary/10 p-8 flex flex-col justify-between group hover:border-primary/60 transition-all duration-300"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: videos.length * 0.1 }}
            viewport={{ once: true }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-primary/20 mb-4 group-hover:bg-primary/30 transition">
                <Flame className="w-6 h-6 text-primary" />
              </div>
              <h4 className="text-2xl font-bold text-foreground mb-2">Explore More on YouTube</h4>
              <p className="text-sm text-muted-foreground">
                Dive deeper into how the Flare Network and XRP ecosystem are shaping the future of decentralized finance.
              </p>
            </div>
            <a
              href="https://www.youtube.com/channel/UCHACcQVpw_p0n03zZdSt4fg/videos"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 mt-6 text-primary font-semibold group-hover:gap-3 transition-all"
            >
              Visit Channel <ArrowRight size={18} className="group-hover:translate-x-1 transition" />
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

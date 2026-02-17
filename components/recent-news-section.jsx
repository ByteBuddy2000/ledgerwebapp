'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ExternalLink } from 'lucide-react'

const news = [
  {
    title: 'Trump IRS Vault Systems Reach New Milestone in Crypto Security',
    url: '#',
    source: 'CryptoDaily',
    time: '3 hours ago',
  },
  {
    title: 'How Advanced Encryption Protects Your Digital Assets in 2025',
    url: '#',
    source: 'Crypto Economy',
    time: '5 hours ago',
  },
  {
    title: 'The Future of Decentralized Finance: What You Need to Know',
    url: '#',
    source: 'Live Bitcoin News',
    time: '5 hours ago',
  },
  {
    title: 'Top Security Practices for Crypto Investors This Year',
    url: '#',
    source: 'Coinpedia',
    time: '9 hours ago',
  },
  {
    title: 'Blockchain Technology Transforms Global Banking System',
    url: '#',
    source: 'Coinpedia',
    time: '15 hours ago',
  },
  {
    title: 'Web3 Jobs Boom: 10 Exciting Roles Available Now',
    url: '#',
    source: 'Cryptopolitan',
    time: 'a day ago',
  },
]

export function RecentNewsSection() {
  return (
    <section className="py-20 bg-background relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl opacity-20"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
        >
          <div className="flex items-center gap-3 mb-12">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold">Recent News & Updates</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {news.map((item, idx) => (
              <motion.div
                key={item.title}
                className="group h-full bg-card border border-border rounded-lg p-6 hover:border-primary/50 hover:bg-card/80 transition duration-300 flex flex-col"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.06 }}
                viewport={{ once: true }}
              >
                <h3 className="font-semibold text-foreground mb-4 group-hover:text-primary transition line-clamp-2">
                  {item.title}
                </h3>

                <div className="flex items-center justify-between mt-auto pt-4 border-t border-border">
                  <div className="text-xs text-muted-foreground">
                    <div className="font-medium text-foreground/80">{item.source}</div>
                    <div>{item.time}</div>
                  </div>
                  <Link href={item.url} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-primary transition" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}

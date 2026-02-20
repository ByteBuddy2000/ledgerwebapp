'use client'

import { useRef } from 'react'
import { useInView, motion } from 'framer-motion'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'

export function FooterSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '0px 0px -100px 0px' })

  const router = useRouter()
  const pathname = usePathname()

  // Same professional scroll logic as Navbar
  const handleSectionNavigation = (sectionId) => {
    if (pathname === '/') {
      const element = document.getElementById(sectionId)
      if (element) {
        const y = element.getBoundingClientRect().top + window.scrollY - 100
        window.scrollTo({ top: y, behavior: 'smooth' })
      }
    } else {
      router.push(`/#${sectionId}`)
    }
  }

  return (
    <footer className="w-full bg-background border-t border-border pt-20 pb-10" ref={ref}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12"
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          {/* Company Info */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-lg">T</span>
              </div>
              <h3 className="text-lg font-bold text-foreground">Trump IRS Vault</h3>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed">
              The Quantum Financial System (Trump IRS Vault) Vault delivers unmatched security and transparency for all currency holders.
              <br /><br />
              With advanced technology and gold-backed currencies, Trump IRS Vault sets a new standard in global finance.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-base font-semibold mb-4 text-foreground">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <button
                  onClick={() => handleSectionNavigation('about')}
                  className="text-muted-foreground hover:text-primary transition"
                >
                  About Trump IRS Vault
                </button>
              </li>
              <li>
                <Link
                  href="/register"
                  className="text-muted-foreground hover:text-primary transition"
                >
                  Register
                </Link>
              </li>
              <li>
                <Link
                  href="/login"
                  className="text-muted-foreground hover:text-primary transition"
                >
                  Login
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-base font-semibold mb-4 text-foreground">Our Services</h3>
            <ul className="space-y-2 text-sm">
              <li className="text-muted-foreground">
                Digital Currency Protection
              </li>
              <li className="text-muted-foreground">
                Wallet Security System
              </li>
              <li className="text-muted-foreground">
                Mobile & Web Banking
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-base font-semibold mb-4 text-foreground">Contact</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li>
                <span className="block font-medium text-foreground mb-1">Email:</span>
                <Link
                  href="mailto:support@trumpirsvault.com"
                  className="hover:text-primary transition"
                >
                  support@trumpirsvault.com
                </Link>
              </li>
              <li>
                <span className="block font-medium text-foreground mb-1">Support:</span>
                <Link
                  href="mailto:support@trumpirsvault.com"
                  className="hover:text-primary transition"
                >
                  support@trumpirsvault.com
                </Link>
              </li>
              <li>
                <span className="block font-medium text-foreground mb-1">Certification:</span>
                <Link href="/certification" className="hover:text-primary transition">
                  View Certification Validity
                </Link>
              </li>
            </ul>
          </div>
        </motion.div>

        {/* Divider */}
        <div className="border-t border-border my-8" />

        {/* Copyright */}
        <motion.div
          className="flex flex-col sm:flex-row items-center justify-center text-xs text-muted-foreground"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: 'easeOut', delay: 0.2 }}
        >
          <p>© 2026 Trump IRS Vault. All rights reserved.</p>
        </motion.div>
      </div>
    </footer>
  )
}

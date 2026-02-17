'use client'

import Link from 'next/link'
import { ArrowLeft, Home } from 'lucide-react'

export default function NotFound() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden px-6">

      {/* ===== Background Glow ===== */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/3 left-1/4 w-72 h-72 bg-primary/20 rounded-full blur-3xl opacity-30 animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl opacity-20"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/5"></div>
      </div>

      {/* ===== Content Card ===== */}
      <div className="relative z-10 max-w-2xl w-full text-center">

        {/* 404 Number */}
        <h1 className="text-7xl sm:text-8xl lg:text-9xl font-bold tracking-tight text-primary/90">
          404
        </h1>

        {/* Title */}
        <h2 className="mt-6 text-2xl sm:text-3xl font-semibold text-foreground">
          Page Not Found
        </h2>

        {/* Description */}
        <p className="mt-4 text-muted-foreground max-w-md mx-auto leading-relaxed">
          The page you're looking for doesn’t exist or may have been moved.
          Please check the URL or return to the homepage.
        </p>

        {/* Actions */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">

          <Link href="/">
            <button className="group flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-semibold shadow-lg shadow-primary/25 hover:opacity-90 transition-all">
              <Home className="w-4 h-4" />
              Go to Homepage
            </button>
          </Link>

          <button
            onClick={() => window.history.back()}
            className="group flex items-center gap-2 px-6 py-3 rounded-xl bg-secondary text-secondary-foreground font-semibold hover:bg-secondary/80 transition-all"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Go Back
          </button>

        </div>

        {/* Divider */}
        <div className="mt-14 border-t border-border/40 pt-8">
          <p className="text-xs text-muted-foreground tracking-wide">
            Trump<span className="text-primary">IRS</span>Vault
          </p>
        </div>

      </div>
    </section>
  )
}

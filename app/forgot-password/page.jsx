'use client'

import { useState } from 'react'
import Link from 'next/link'
import { toast } from 'sonner'
import { Mail, ArrowRight, ArrowLeft } from 'lucide-react'
import { motion } from 'framer-motion'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      toast.error('Please enter a valid email address')
      return
    }

    setSubmitting(true)
    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      const data = await res.json()
      if (res.ok) {
        setSubmitted(true)
        toast.success('Password reset link sent!')
      } else {
        toast.error(data?.error || 'Could not process request')
      }
    } catch (err) {
      console.error(err)
      toast.error('Server error. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden">
      {/* Background gradient effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 right-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-20 left-1/4 w-72 h-72 bg-primary/10 rounded-full blur-3xl opacity-10"></div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10 px-4"
      >
        {/* Card */}
        <div className="bg-card border border-primary/20 rounded-2xl p-8 backdrop-blur-sm">
          {/* Header */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, duration: 0.4 }}
              className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center mx-auto mb-4 border border-primary/50"
            >
              <Mail className="w-6 h-6 text-primary" />
            </motion.div>
            <h1 className="text-2xl font-bold text-foreground mb-2">Reset Password</h1>
            <p className="text-sm text-muted-foreground">
              {submitted
                ? 'Check your email for reset instructions'
                : 'Enter your email to receive a password reset link'}
            </p>
          </div>

          {!submitted ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Field */}
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-foreground">
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  className="w-full px-4 py-3 rounded-lg bg-background border border-border text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  aria-label="Email"
                />
              </div>

              {/* Info Box */}
              <div className="bg-primary/10 border border-primary/30 rounded-lg p-4">
                <p className="text-sm text-foreground">
                  We'll send you a secure link to reset your password. The link will expire after 24 hours for security.
                </p>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3 rounded-lg bg-primary text-primary-foreground font-semibold hover:opacity-90 transition disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {submitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin"></div>
                    Sending...
                  </>
                ) : (
                  <>
                    Send Reset Link
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-6 text-center"
            >
              <div className="bg-primary/10 border border-primary/30 rounded-lg p-6">
                <p className="text-foreground mb-2 font-medium">Check your inbox</p>
                <p className="text-sm text-muted-foreground mb-4">
                  We've sent a password reset link to <span className="font-medium text-foreground">{email}</span>
                </p>
                <p className="text-xs text-muted-foreground">
                  If you don't see the email, check your spam folder or try again in a few minutes.
                </p>
              </div>

              <button
                onClick={() => setSubmitted(false)}
                className="w-full py-3 rounded-lg border border-primary/50 text-primary font-semibold hover:bg-primary/10 transition"
              >
                Try Different Email
              </button>
            </motion.div>
          )}

          {/* Footer Links */}
          <div className="mt-6 flex items-center justify-between">
            <Link href="/login" className="text-sm text-muted-foreground hover:text-foreground transition flex items-center gap-1">
              <ArrowLeft className="w-4 h-4" />
              Back to sign in
            </Link>
            <Link href="/" className="text-sm text-muted-foreground hover:text-foreground transition">
              Home
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

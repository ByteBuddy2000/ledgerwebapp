'use client'

import { useSearchParams, useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { Lock, Eye, EyeOff, CheckCircle, AlertCircle, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { toast } from 'sonner'

export default function ResetPasswordPage() {
  const searchParams = useSearchParams()
  const router = useRouter()

  const token = searchParams.get('token')
  const id = searchParams.get('id')

  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [validating, setValidating] = useState(true)
  const [tokenValid, setTokenValid] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const validateToken = async () => {
      if (!token || !id) {
        setError('Invalid reset link')
        setValidating(false)
        return
      }

      try {
        const res = await fetch('/api/auth/verify-reset-token', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token, id }),
        })
        const data = await res.json()
        if (res.ok && data.valid) {
          setTokenValid(true)
        } else {
          setError(data.error || 'Reset link is invalid or expired')
        }
      } catch (err) {
        console.error(err)
        setError('Failed to validate reset link')
      } finally {
        setValidating(false)
      }
    }

    validateToken()
  }, [token, id])  

  const validatePassword = (pwd) => {
    if (pwd.length < 8) return { valid: false, message: 'At least 8 characters' }
    if (!/[A-Z]/.test(pwd)) return { valid: false, message: 'One uppercase letter' }
    if (!/[a-z]/.test(pwd)) return { valid: false, message: 'One lowercase letter' }
    if (!/[0-9]/.test(pwd)) return { valid: false, message: 'One number' }
    if (!/[!@#$%^&*]/.test(pwd)) return { valid: false, message: 'One special character (!@#$%^&*)' }
    return { valid: true }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!password || !confirmPassword) {
      setError('Please fill in all fields')
      return
    }

    const passwordValidation = validatePassword(password)
    if (!passwordValidation.valid) {
      setError(`Password must contain ${passwordValidation.message}`)
      return
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    setLoading(true)

    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, id, password }),
      })
      const data = await res.json()

      if (res.ok && data.success) {
        setSuccess(true)
        toast.success('Password reset successfully!')
        setTimeout(() => router.push('/login'), 2500)
      } else {
        setError(data.error || 'Failed to reset password')
        toast.error(data.error || 'Failed to reset password')
      }
    } catch (err) {
      console.error(err)
      setError('Server error. Please try again.')
      toast.error('Server error. Please try again.')
    }

    setLoading(false)
  }

  // Validating state
  if (validating) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden">
        {/* Background gradient effects */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 right-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl opacity-20 animate-pulse"></div>
          <div className="absolute bottom-20 left-1/4 w-72 h-72 bg-primary/10 rounded-full blur-3xl opacity-10"></div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="relative z-10"
        >
          <div className="bg-card border border-primary/20 rounded-2xl p-8 backdrop-blur-sm w-80">
            <div className="flex flex-col items-center justify-center gap-4">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full"
              />
              <p className="text-muted-foreground text-sm">Validating reset link...</p>
            </div>
          </div>
        </motion.div>
      </div>
    )
  }

  // Invalid token state
  if (!tokenValid) {
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
          <div className="bg-card border border-destructive/20 rounded-2xl p-8 backdrop-blur-sm">
            <div className="flex flex-col items-center text-center gap-4">
              <div className="bg-destructive/10 p-3 rounded-full">
                <AlertCircle className="w-10 h-10 text-destructive" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-foreground mb-1">Invalid Reset Link</h2>
                <p className="text-sm text-muted-foreground">
                  This password reset link is invalid or has expired. Please request a new one.
                </p>
              </div>
              <div className="w-full space-y-3 mt-2">
                <Link
                  href="/forgot-password"
                  className="w-full py-3 rounded-lg bg-primary text-primary-foreground font-semibold hover:opacity-90 transition flex items-center justify-center gap-2"
                >
                  Request New Reset Link
                </Link>
                <Link
                  href="/login"
                  className="w-full py-3 rounded-lg border border-primary/50 text-primary font-semibold hover:bg-primary/10 transition"
                >
                  Back to Login
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    )
  }

  // Success state
  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden">
        {/* Background gradient effects */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 right-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl opacity-20 animate-pulse"></div>
          <div className="absolute bottom-20 left-1/4 w-72 h-72 bg-primary/10 rounded-full blur-3xl opacity-10"></div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md relative z-10 px-4"
        >
          <div className="bg-card border border-primary/20 rounded-2xl p-8 backdrop-blur-sm">
            <div className="flex flex-col items-center text-center gap-4">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', delay: 0.2 }}
                className="bg-primary/10 p-3 rounded-full"
              >
                <CheckCircle className="w-10 h-10 text-primary" />
              </motion.div>
              <div>
                <h2 className="text-lg font-bold text-foreground mb-1">Password Reset Successful</h2>
                <p className="text-sm text-muted-foreground">
                  Your password has been reset successfully. Redirecting to login...
                </p>
              </div>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: '100%' }}
                transition={{ duration: 2.5 }}
                className="h-1 bg-primary rounded-full absolute bottom-0 left-0"
              />
            </div>
          </div>
        </motion.div>
      </div>
    )
  }

  // Main form state
  return (
    <div className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden px-4 py-6">
      {/* Background gradient effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 right-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-20 left-1/4 w-72 h-72 bg-primary/10 rounded-full blur-3xl opacity-10"></div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10"
      >
        {/* Card */}
        <div className="bg-card border border-primary/20 rounded-2xl p-8 backdrop-blur-sm">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-12 h-12 rounded-lg bg-primary flex items-center justify-center mx-auto mb-4">
              <Lock className="text-primary-foreground w-6 h-6" />
            </div>
            <h1 className="text-2xl font-bold text-foreground mb-2">Reset Password</h1>
            <p className="text-sm text-muted-foreground">Enter a new password for your account</p>
          </div>

          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 bg-destructive/10 border border-destructive/30 rounded-lg flex items-start gap-3"
            >
              <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
              <p className="text-sm text-destructive">{error}</p>
            </motion.div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* New Password */}
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium text-foreground">
                New Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 rounded-lg bg-background border border-border text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition pr-10"
                  required
                  aria-label="New password"
                />
                <button
                  type="button"
                  tabIndex={-1}
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              <p className="text-xs text-muted-foreground">
                Minimum 8 characters with uppercase, lowercase, number, and special character
              </p>
            </div>

            {/* Confirm Password */}
            <div className="space-y-2">
              <label htmlFor="confirm-password" className="text-sm font-medium text-foreground">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  id="confirm-password"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 rounded-lg bg-background border border-border text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition pr-10"
                  required
                  aria-label="Confirm password"
                />
                <button
                  type="button"
                  tabIndex={-1}
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition"
                  aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                >
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-lg bg-primary text-primary-foreground font-semibold hover:opacity-90 transition disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin"></div>
                  Resetting...
                </>
              ) : (
                <>
                  Reset Password
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Footer Links */}
          <div className="mt-6 text-center">
            <Link href="/login" className="text-sm text-muted-foreground hover:text-foreground transition">
              ← Back to login
            </Link>
          </div>
        </div>

        {/* Trust Badge */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="text-center mt-6 text-xs text-muted-foreground"
        >
          <p>🔒 This link expires in 1 hour for security purposes</p>
        </motion.div>
      </motion.div>
    </div>
  )
}

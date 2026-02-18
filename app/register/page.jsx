'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { toast } from 'sonner'
import { motion } from 'framer-motion'
import {
  Shield,
  User,
  Mail,
  Phone,
  MapPin,
  Lock,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  Building,
  Globe,
} from 'lucide-react'

export default function RegisterPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [form, setForm] = useState({
    username: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    country: '',
    state: '',
    zipCode: '',
    accountType: 'personal',
  })
  const [loading, setLoading] = useState(false)

  const steps = [
    { id: 1, title: 'Account Setup', description: 'Create your account' },
    { id: 2, title: 'Personal Info', description: 'Tell us about yourself' },
    { id: 3, title: 'Security', description: 'Secure your account' },
  ]

  const progress = (step / 3) * 100

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleAccountTypeChange = (value) => {
    setForm({ ...form, accountType: value })
  }

  const isStep1Valid = form.username.trim() && form.email.trim() && form.phone.trim() && form.accountType.trim()
  const isStep2Valid = form.firstName.trim() && form.lastName.trim() && form.country.trim() && form.state.trim() && form.zipCode.trim()
  const isStep3Valid = form.password.trim() && form.confirmPassword.trim() && form.password === form.confirmPassword

  const handleNext = () => {
    if (step < 3) setStep(step + 1)
  }

  const handleBack = () => {
    if (step > 1) setStep(step - 1)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (form.password !== form.confirmPassword) {
      toast.error('Passwords do not match')
      return
    }

    setLoading(true)
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (res.ok) {
        toast.success('Account created! Redirecting to login...')
        router.push('/login')
      } else {
        toast.error(data.message || 'Registration failed')
      }
    } catch (err) {
      console.error(err)
      toast.error('Registration failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center py-12 px-4 relative overflow-hidden">
      {/* Background gradient effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 right-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-20 left-1/4 w-72 h-72 bg-primary/10 rounded-full blur-3xl opacity-10"></div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-2xl relative z-10"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, duration: 0.4 }}
            className="w-14 h-14 rounded-lg bg-primary flex items-center justify-center mx-auto mb-4"
          >
            <Image
                    src="/tiv-logo.png"
                    alt="Trump IRS Vault Logo"
                    fill
                    className="object-contain"
                    priority
                  />
          </motion.div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Create Your Account</h1>
          <p className="text-muted-foreground">Join millions securing their assets with Trumpirsvault</p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            {steps.map((s, index) => (
              <div key={s.id} className="flex items-center flex-1">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.1 * index }}
                  className={`flex items-center justify-center w-10 h-10 rounded-full border-2 font-semibold ${
                    step >= s.id
                      ? 'bg-primary border-primary text-primary-foreground'
                      : 'border-border text-muted-foreground bg-card'
                  }`}
                >
                  {step > s.id ? <CheckCircle className="w-5 h-5" /> : s.id}
                </motion.div>
                {index < steps.length - 1 && (
                  <div
                    className={`flex-1 h-1 mx-2 rounded-full ${step > s.id ? 'bg-primary' : 'bg-border'}`}
                  />
                )}
              </div>
            ))}
          </div>

          {/* Progress Bar */}
          <div className="w-full h-1 bg-border rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-primary"
              initial={{ width: '33.33%' }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        {/* Card */}
        <div className="bg-card border border-primary/20 rounded-2xl p-8 backdrop-blur-sm">
          {/* Step Header */}
          <div className="text-center mb-8">
            <p className="text-sm text-primary font-semibold">STEP {step} OF 3</p>
            <h2 className="text-2xl font-bold text-foreground mt-2">{steps[step - 1].title}</h2>
            <p className="text-muted-foreground mt-1">{steps[step - 1].description}</p>
          </div>

          <form onSubmit={step === 3 ? handleSubmit : (e) => { e.preventDefault(); handleNext() }}>
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              {/* Step 1: Account Setup */}
              {step === 1 && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="text-sm font-medium text-foreground flex items-center gap-2 mb-2">
                        <User className="w-4 h-4" />
                        Username
                      </label>
                      <input
                        type="text"
                        name="username"
                        value={form.username}
                        onChange={handleChange}
                        placeholder="Choose a username"
                        className="w-full px-4 py-3 rounded-lg bg-background border border-border text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition"
                        required
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium text-foreground flex items-center gap-2 mb-2">
                        <Mail className="w-4 h-4" />
                        Email Address
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        placeholder="you@example.com"
                        className="w-full px-4 py-3 rounded-lg bg-background border border-border text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition"
                        required
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium text-foreground flex items-center gap-2 mb-2">
                        <Phone className="w-4 h-4" />
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={form.phone}
                        onChange={handleChange}
                        placeholder="+1 (555) 123-4567"
                        className="w-full px-4 py-3 rounded-lg bg-background border border-border text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition"
                        required
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium text-foreground flex items-center gap-2 mb-2">
                        <Building className="w-4 h-4" />
                        Account Type
                      </label>
                      <select
                        name="accountType"
                        value={form.accountType}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-lg bg-background border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition"
                      >
                        <option value="personal">Personal</option>
                        <option value="business">Business</option>
                      </select>
                    </div>
                  </div>

                  <div className="bg-primary/10 border border-primary/30 rounded-lg p-4 flex items-start gap-3">
                    <Shield className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-foreground">Bank-Level Security</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        Your information is protected with 256-bit encryption and multi-factor authentication.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Personal Info */}
              {step === 2 && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="text-sm font-medium text-foreground mb-2 block">First Name</label>
                      <input
                        type="text"
                        name="firstName"
                        value={form.firstName}
                        onChange={handleChange}
                        placeholder="John"
                        className="w-full px-4 py-3 rounded-lg bg-background border border-border text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition"
                        required
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium text-foreground mb-2 block">Last Name</label>
                      <input
                        type="text"
                        name="lastName"
                        value={form.lastName}
                        onChange={handleChange}
                        placeholder="Doe"
                        className="w-full px-4 py-3 rounded-lg bg-background border border-border text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition"
                        required
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium text-foreground flex items-center gap-2 mb-2">
                        <Globe className="w-4 h-4" />
                        Country
                      </label>
                      <input
                        type="text"
                        name="country"
                        value={form.country}
                        onChange={handleChange}
                        placeholder="United States"
                        className="w-full px-4 py-3 rounded-lg bg-background border border-border text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition"
                        required
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium text-foreground flex items-center gap-2 mb-2">
                        <MapPin className="w-4 h-4" />
                        State/Province
                      </label>
                      <input
                        type="text"
                        name="state"
                        value={form.state}
                        onChange={handleChange}
                        placeholder="California"
                        className="w-full px-4 py-3 rounded-lg bg-background border border-border text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition"
                        required
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium text-foreground mb-2 block">Zip/Postal Code</label>
                      <input
                        type="text"
                        name="zipCode"
                        value={form.zipCode}
                        onChange={handleChange}
                        placeholder="90210"
                        className="w-full px-4 py-3 rounded-lg bg-background border border-border text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition"
                        required
                      />
                    </div>
                  </div>

                  <div className="bg-primary/10 border border-primary/30 rounded-lg p-4 flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-foreground">Identity Verification</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        This helps us comply with regulations and keep your account secure.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Security */}
              {step === 3 && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="text-sm font-medium text-foreground flex items-center gap-2 mb-2">
                        <Lock className="w-4 h-4" />
                        Password
                      </label>
                      <input
                        type="password"
                        name="password"
                        value={form.password}
                        onChange={handleChange}
                        placeholder="Create a strong password"
                        className="w-full px-4 py-3 rounded-lg bg-background border border-border text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition"
                        required
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium text-foreground flex items-center gap-2 mb-2">
                        <Lock className="w-4 h-4" />
                        Confirm Password
                      </label>
                      <input
                        type="password"
                        name="confirmPassword"
                        value={form.confirmPassword}
                        onChange={handleChange}
                        placeholder="Confirm your password"
                        className="w-full px-4 py-3 rounded-lg bg-background border border-border text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition"
                        required
                      />
                    </div>
                  </div>

                  <div className="bg-primary/10 border border-primary/30 rounded-lg p-4">
                    <p className="font-medium text-foreground mb-3">Password Requirements:</p>
                    <ul className="text-sm text-muted-foreground space-y-2">
                      <li className={form.password.length >= 8 ? 'text-primary line-through' : ''}>
                        ✓ At least 8 characters long
                      </li>
                      <li className={/[A-Z]/.test(form.password) && /[a-z]/.test(form.password) ? 'text-primary line-through' : ''}>
                        ✓ Include uppercase and lowercase letters
                      </li>
                      <li className={/\d/.test(form.password) ? 'text-primary line-through' : ''}>
                        ✓ Include at least one number
                      </li>
                      <li className={/[!@#$%^&*]/.test(form.password) ? 'text-primary line-through' : ''}>
                        ✓ Include special character (!@#$%^&*)
                      </li>
                    </ul>
                  </div>
                </div>
              )}
            </motion.div>

            {/* Navigation Buttons */}
            <div className="flex gap-4 mt-8">
              {step > 1 && (
                <button
                  type="button"
                  onClick={handleBack}
                  className="flex-1 py-3 rounded-lg border border-border text-foreground font-semibold hover:bg-card transition flex items-center justify-center gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back
                </button>
              )}

              <button
                type={step === 3 ? 'submit' : 'button'}
                onClick={step !== 3 ? handleNext : undefined}
                disabled={(step === 1 && !isStep1Valid) || (step === 2 && !isStep2Valid) || (step === 3 && !isStep3Valid) || loading}
                className="flex-1 py-3 rounded-lg bg-primary text-primary-foreground font-semibold hover:opacity-90 transition disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin"></div>
                    Creating...
                  </>
                ) : step === 3 ? (
                  <>
                    Create Account
                    <CheckCircle className="w-4 h-4" />
                  </>
                ) : (
                  <>
                    Continue
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Sign In Link */}
          <div className="text-center mt-6 text-sm">
            <span className="text-muted-foreground">Already have an account? </span>
            <Link href="/login" className="text-primary hover:text-primary/80 font-semibold transition">
              Sign in here
            </Link>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-6">
          <Link href="/" className="text-muted-foreground hover:text-foreground transition text-sm">
            ← Back to home
          </Link>
        </div>
      </motion.div>
    </div>
  )
}

"use client"

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
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
  Wallet,
  Globe,
  Building,
} from "lucide-react"

export default function SecureLedgerOnboarding() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [form, setForm] = useState({
    username: "",
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    password: "",
    confirmPassword: "",
    country: "",
    state: "",
    zipCode: "",
    accountType: "personal",
  })
  const [loading, setLoading] = useState(false)

  const steps = [
    { id: 1, title: "Account Setup", description: "Create your secure account" },
    { id: 2, title: "Personal Info", description: "Tell us about yourself" },
    { id: 3, title: "Security", description: "Secure your wallet" },
  ]

  const progress = (step / 3) * 100

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleAccountTypeChange = (value) => setForm({ ...form, accountType: value })

  // Validation for each step
  const isStep1Valid =
    form.username.trim() &&
    form.email.trim() &&
    form.phone.trim() &&
    form.accountType.trim()

  const isStep2Valid =
    form.firstName.trim() &&
    form.lastName.trim() &&
    form.country.trim() &&
    form.state.trim() &&
    form.zipCode.trim()

  const isStep3Valid =
    form.password.trim() &&
    form.confirmPassword.trim()

  const handleNext = () => {
    if (step < 3) setStep(step + 1)
  }

  const handleBack = () => {
    if (step > 1) setStep(step - 1)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (form.password !== form.confirmPassword) {
      toast.error("Passwords do not match")
      return
    }
    setLoading(true)
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (res.ok) {
        toast.success("Welcome to Secure Ledger! Setting up your account...")
        router.push("/dashboard")
      } else {
        toast.error(data.message || "Registration failed")
      }
    } catch (err) {
      toast.error("Registration failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
        <div className="text-center mb-6">
          <img src="/qfslogo.png" alt="Logo" className="mx-auto h-12" />
          <h2 className="mt-2 text-lg font-medium text-gray-700">
            Login to your Account
          </h2>
        </div>
          <p className="text-blue-200 text-lg">Join the future of secure digital transactions</p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            {steps.map((s, index) => (
              <div key={s.id} className="flex items-center">
                <div
                  className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                    step >= s.id ? "bg-blue-600 border-blue-600 text-white" : "border-blue-300 text-blue-300"
                  }`}
                >
                  {step > s.id ? <CheckCircle className="h-5 w-5" /> : s.id}
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-20 h-0.5 mx-4 ${step > s.id ? "bg-blue-600" : "bg-blue-300"}`} />
                )}
              </div>
            ))}
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Main Card */}
        <Card className="bg-white/95 backdrop-blur-sm shadow-2xl border-0">
          <CardHeader className="text-center pb-6">
            <div className="flex items-center justify-center mb-2">
              <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                Step {step} of 3
              </Badge>
            </div>
            <CardTitle className="text-2xl text-gray-800">{steps[step - 1].title}</CardTitle>
            <p className="text-gray-600">{steps[step - 1].description}</p>
          </CardHeader>

          <CardContent className="px-8 pb-8">
            {/* Step 1: Account Setup */}
            {step === 1 && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 md:grid-cols-2 gap-6">
                  <div className="space-y-2 text-xs">
                    <Label htmlFor="username" className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      Username
                    </Label>
                    <Input
                      id="username"
                      name="username"
                      value={form.username}
                      onChange={handleChange}
                      placeholder="Choose a unique username"
                      className="h-10"
                      required
                    />
                  </div>
                  <div className="space-y-2 text-xs">
                    <Label htmlFor="email" className="flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      Email Address
                    </Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="your@email.com"
                      className="h-10"
                      required
                    />
                  </div>
                  <div className="space-y-2 text-xs">
                    <Label htmlFor="phone" className="flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      Phone Number
                    </Label>
                    <Input
                      id="phone"
                      name="phone"
                      value={form.phone}
                      onChange={handleChange}
                      placeholder="+1 (555) 123-4567"
                      className="h-10"
                      required
                    />
                  </div>
                  <div className="space-y-2 text-xs">
                    <Label htmlFor="accountType" className="flex items-center gap-2">
                      <Building className="h-4 w-4" />
                      Account Type
                    </Label>
                    <Select value={form.accountType} onValueChange={handleAccountTypeChange}>
                      <SelectTrigger className="h-10">
                        <SelectValue placeholder="Select account type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="personal">
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4" />
                            Personal
                          </div>
                        </SelectItem>
                        <SelectItem value="business">
                          <div className="flex items-center gap-2">
                            <Building className="h-4 w-4" />
                            Business
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <div className="flex items-start gap-3">
                    <Shield className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-blue-900">Bank-Level Security</h4>
                      <p className="text-sm text-blue-700">
                        Your information is protected with 256-bit encryption and multi-factor authentication.
                      </p>
                    </div>
                  </div>
                </div>

                <Button
                  onClick={handleNext}
                  className="w-full h-12 bg-blue-600 hover:bg-blue-700"
                  disabled={!isStep1Valid}
                >
                  Continue to Profile
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            )}

            {/* Step 2: Personal Info */}
            {step === 2 && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 md:grid-cols-2 gap-6">
                  <div className="space-y-2 text-xs">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      name="firstName"
                      value={form.firstName}
                      onChange={handleChange}
                      placeholder="John"
                      className="h-10"
                    />
                  </div>
                  <div className="space-y-2 text-xs">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      name="lastName"
                      value={form.lastName}
                      onChange={handleChange}
                      placeholder="Doe"
                      className="h-10"
                    />
                  </div>
                  <div className="space-y-2 text-xs">
                    <Label htmlFor="country" className="flex items-center gap-2">
                      <Globe className="h-4 w-4" />
                      Country
                    </Label>
                    <Input
                      id="country"
                      name="country"
                      value={form.country}
                      onChange={handleChange}
                      placeholder="United States"
                      className="h-10"
                    />
                  </div>
                  <div className="space-y-2 text-xs">
                    <Label htmlFor="state" className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      State/Province
                    </Label>
                    <Input
                      id="state"
                      name="state"
                      value={form.state}
                      onChange={handleChange}
                      placeholder="California"
                      className="h-10"
                    />
                  </div>
                  <div className="space-y-2 md:col-span-1 text-xs">
                    <Label htmlFor="zipCode">Zip/Postal Code</Label>
                    <Input
                      id="zipCode"
                      name="zipCode"
                      value={form.zipCode}
                      onChange={handleChange}
                      placeholder="90210"
                      className="h-10"
                    />
                  </div>
                </div>

                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-green-900">Identity Verification</h4>
                      <p className="text-sm text-green-700">
                        This information helps us comply with financial regulations and keep your account secure.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between">
                  <Button variant="outline" onClick={handleBack} className="h-12 bg-transparent">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back
                  </Button>
                  <Button
                    onClick={handleNext}
                    className="h-12 bg-blue-600 hover:bg-blue-700"
                    disabled={!isStep2Valid}
                  >
                    Continue to Security
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}

            {/* Step 3: Security */}
            {step === 3 && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 md:grid-cols-2 gap-6">
                  <div className="space-y-2 text-xs">
                    <Label htmlFor="password" className="flex items-center gap-2">
                      <Lock className="h-4 w-4" />
                      Password
                    </Label>
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      value={form.password}
                      onChange={handleChange}
                      placeholder="Create a strong password"
                      className="h-10"
                      required
                    />
                  </div>
                  <div className="space-y-2 text-xs">
                    <Label htmlFor="confirmPassword" className="flex items-center gap-2">
                      <Lock className="h-4 w-4" />
                      Confirm Password
                    </Label>
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      value={form.confirmPassword}
                      onChange={handleChange}
                      placeholder="Confirm your password"
                      className="h-10"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
                    <div className="flex items-start gap-3">
                      <Shield className="h-5 w-5 text-amber-600 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-amber-900">Password Requirements</h4>
                        <ul className="text-sm text-amber-700 mt-1 space-y-1">
                          <li>• At least 8 characters long</li>
                          <li>• Include uppercase and lowercase letters</li>
                          <li>• Include at least one number</li>
                          <li>• Include at least one special character</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <div className="flex items-start gap-3">
                      <Wallet className="h-5 w-5 text-blue-600 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-blue-900">Your Secure Wallet</h4>
                        <p className="text-sm text-blue-700">
                          Once registered, you'll receive a secure digital wallet with advanced encryption and backup
                          options.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between">
                  <Button variant="outline" onClick={handleBack} className="h-12 bg-transparent">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back
                  </Button>
                  <Button
                    onClick={handleSubmit}
                    disabled={loading || !isStep3Valid}
                    className="h-12 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Creating Account...
                      </>
                    ) : (
                      <>
                        Create Secure Account
                        <CheckCircle className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-xs text-center mt-8">
          <p className="text-blue-200 mb-2">
            Already have an account?{" "}
            <a href="/login" className="text-white hover:underline font-medium">
              Sign in here
            </a>
          </p>
          <div className="hidden  items-center justify-center gap-4 text-sm text-blue-300">
            <a href="/#privacy" className="hover:text-white">
              Privacy Policy
            </a>
            <span>•</span>
            <a href="/#terms" className="hover:text-white">
              Terms of Service
            </a>
            <span>•</span>
            <a href="/#security" className="hover:text-white">
              Security
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
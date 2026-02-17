'use client'

import { motion } from 'framer-motion'
import { Mail, MessageSquare, Phone } from 'lucide-react'
import { useState } from 'react'

export function TouchSection() {
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()

    const form = e.target
    const name = form.fullName.value
    const email = form.email.value
    const subject = form.subject.value
    const message = form.message.value

    setIsLoading(true)
    setIsSuccess(false)

    // Build mailto link
    const mailtoLink = `mailto:support@trumpirsvault.com?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(
      `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`
    )}`

    // Open email client
    window.location.href = mailtoLink

    // Show success state
    setTimeout(() => {
      setIsLoading(false)
      setIsSuccess(true)
      form.reset()

      setTimeout(() => {
        setIsSuccess(false)
      }, 4000)
    }, 800)
  }

  return (
    <section id="contact" className="w-full py-20 bg-background relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-primary/10 rounded-full blur-3xl opacity-20"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.h2
            className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            Get in Touch with Our Team
          </motion.h2>

          <p className="text-muted-foreground max-w-2xl mx-auto">
            Have questions or need assistance? Contact us and our team will get back to you within 24 hours.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
            className="flex flex-col justify-center"
          >
            <form onSubmit={handleSubmit} className="space-y-6">

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Full Name
                  </label>
                  <input
                    name="fullName"
                    type="text"
                    placeholder="John Doe"
                    required
                    className="w-full px-4 py-3 rounded-lg bg-card border border-border text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary/50 transition"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Email Address
                  </label>
                  <input
                    name="email"
                    type="email"
                    placeholder="john@example.com"
                    required
                    className="w-full px-4 py-3 rounded-lg bg-card border border-border text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary/50 transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Subject
                </label>
                <input
                  name="subject"
                  type="text"
                  placeholder="How can we help?"
                  required
                  className="w-full px-4 py-3 rounded-lg bg-card border border-border text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary/50 transition"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Message
                </label>
                <textarea
                  name="message"
                  rows={5}
                  placeholder="Tell us more about your inquiry..."
                  required
                  className="w-full px-4 py-3 rounded-lg bg-card border border-border text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary/50 transition resize-none"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full px-6 py-3 rounded-lg bg-primary text-primary-foreground font-semibold hover:opacity-90 transition disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    Sending...
                  </>
                ) : (
                  'Send Message'
                )}
              </button>

              {/* Success Message */}
              {isSuccess && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-sm text-green-500 font-medium"
                >
                  ✅ Email draft ready. Please tap Send in your mail app to complete.
                </motion.div>
              )}

            </form>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <h3 className="text-2xl font-bold mb-6">Contact Information</h3>

            <div className="flex gap-4">
              <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-primary/10">
                <Mail className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h4 className="text-lg font-semibold text-foreground">Email</h4>
                <p className="text-muted-foreground">
                  <a
                    href="mailto:support@trumpirsvault.com"
                    className="hover:text-primary transition"
                  >
                    support@trumpirsvault.com
                  </a>
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-primary/10">
                <MessageSquare className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h4 className="text-lg font-semibold text-foreground">Live Chat</h4>
                <p className="text-muted-foreground">Available 24/7 on our website</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-primary/10">
                <Phone className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h4 className="text-lg font-semibold text-foreground">Phone Support</h4>
                <p className="text-muted-foreground">
                  <a
                    href="tel:+18287965449"
                    className="hover:text-primary transition"
                  >
                    +1 (828) 796-5449
                  </a>
                </p>
              </div>
            </div>

          </motion.div>
        </div>
      </div>
    </section>
  )
}

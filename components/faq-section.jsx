'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { ChevronDown } from 'lucide-react'

const faqs = [
  {
    question: 'What is the Trump IRS Vault?',
    answer: 'The Trump IRS Vault is a secure digital wallet and asset management platform that provides immunity against cyber attacks and market volatility through advanced encryption and security protocols.',
  },
  {
    question: 'Do I need prior experience with crypto to use this platform?',
    answer: 'No experience required! We have a dedicated support team ready to guide you through risk management and asset optimization. Our platform is designed to be user-friendly for beginners.',
  },
  {
    question: 'Is account registration free?',
    answer: 'Yes! Registration is completely free. Create your account, verify your identity, and start securing your digital assets immediately without any upfront costs.',
  },
  {
    question: 'How do I get started?',
    answer: 'Simply register a free account, verify your identity through our secure process, log into your dashboard, and follow the wallet setup instructions to begin.',
  },
  {
    question: 'How can this help improve my financial situation?',
    answer: 'QFS provides comprehensive protection for your crypto assets, shields you from market volatility, prevents fraud, and offers transparent transaction management for optimal financial growth.',
  },
  {
    question: 'When will I receive payouts?',
    answer: 'All transactions and payouts are processed automatically by our system in real-time, ensuring seamless and instant transfers directly to your wallet.',
  },
]

export function FaqSection() {
  const [activeIndex, setActiveIndex] = useState(null)

  const toggleFAQ = (index) => {
    setActiveIndex(index === activeIndex ? null : index)  
  }

  return (
    <section className="py-20 relative overflow-hidden bg-background">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-40 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl opacity-20"></div>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-balance mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Have questions about our platform? Find answers to common questions. Contact our support team at{' '}
            <a href="mailto:support@trumpirsvault.com" className="text-primary hover:underline">
              support@trumpirsvault.com
            </a>
          </p>
        </motion.div>

        {/* FAQ Items */}
        <div className="space-y-3">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05, duration: 0.4 }}
              viewport={{ once: true }}
            >
              <button
                onClick={() => toggleFAQ(index)}
                className={`w-full transition-all duration-300 rounded-lg border ${
                  activeIndex === index
                    ? 'bg-primary/20 border-primary/40'
                    : 'bg-card border-border hover:border-primary/50'
                } p-6 text-left group`}
              >
                <div className="flex justify-between items-start gap-4">
                  <span className="font-semibold text-foreground group-hover:text-primary transition">
                    {faq.question}
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 text-primary flex-shrink-0 transition-transform duration-300 ${
                      activeIndex === index ? 'rotate-180' : ''
                    }`}
                  />
                </div>

                {activeIndex === index && (
                  <motion.p
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="mt-4 text-muted-foreground leading-relaxed"
                  >
                    {faq.answer}
                  </motion.p>
                )}
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

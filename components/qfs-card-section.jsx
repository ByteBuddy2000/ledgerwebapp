'use client'

import { motion } from 'framer-motion'
import { CheckCircle2 } from 'lucide-react'
import Link from 'next/link'

const steps = [
    {
        title: 'Sign Up',
        desc: 'Create your Trump IRS Vault account and complete secure onboarding with identity verification.',
    },
    {
        title: 'Wait for Approval',
        desc: 'Once KYC is approved, sync your wallet and optionally apply for a humanitarian project.',
    },
    {
        title: 'Get Your Trump IRS Vault Card',
        desc: 'Enjoy seamless global payments and access to next-gen quantum tools and platforms.',
    },
]

export function QFSCardSection() {
    return (
        <section className="relative py-20 sm:py-32 overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
                    {/* Left Content */}
                    <motion.div
                        initial={{ opacity: 0, x: -40 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-6 leading-tight">
                            Get Your Trump IRS Vault Card & Shop in Over 118 Countries
                        </h2>
                        <p className="text-base sm:text-lg text-muted-foreground mb-8 leading-relaxed">
                            Sign up now to synchronize your digital wallets with the Quantum Financial System. With the Trump IRS Vault card, you'll unlock ultra-secure transactions, fast global transfers, and access to exclusive technologies.
                        </p>

                        <div className="space-y-4 mb-10">
                            {steps.map((step, idx) => (
                                <motion.div
                                    key={step.title}
                                    className="flex gap-4 items-start"
                                    initial={{ opacity: 0, x: -20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.6, delay: idx * 0.1 }}
                                    viewport={{ once: true }}
                                >
                                    <div className="flex-shrink-0 mt-1">
                                        <div className="flex items-center justify-center h-6 w-6 rounded-full bg-primary/20">
                                            <CheckCircle2 className="h-5 w-5 text-primary" />
                                        </div>
                                    </div>
                                    <div>
                                        <h4 className="text-lg font-semibold text-foreground mb-1">{step.title}</h4>
                                        <p className="text-sm text-muted-foreground">{step.desc}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        <Link href="/login">
                            <button className="px-8 py-3 rounded-full bg-primary text-primary-foreground font-semibold hover:opacity-90 transition">
                                Get Started
                            </button>
                        </Link>
                    </motion.div>

                    {/* Right Image */}
                    <motion.div
                        className="relative"
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                    >
                        <div className="absolute -inset-4 bg-gradient-to-br from-primary/20 to-transparent rounded-3xl blur-2xl opacity-50"></div>

                        <div className="relative bg-gradient-to-br from-card/80 to-card/40 border border-primary/20 rounded-3xl p-8 backdrop-blur-sm">

                            <div className="aspect-square bg-gradient-to-br from-primary/30 via-primary/10 to-transparent rounded-2xl flex items-center justify-center overflow-hidden">

                                <img
                                    src="/QFSCard.webp"
                                    alt="Trump IRS Vault Card"
                                    className="w-full h-full object-contain"
                                />

                            </div>
                        </div>
                    </motion.div>

                </div>
            </div>
        </section>
    )
}

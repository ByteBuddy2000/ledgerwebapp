'use client'

import { motion } from 'framer-motion'
import { Lock, Handshake, BookOpen } from 'lucide-react'

const features = [
    {
        icon: Lock,
        title: 'Military-Grade Security',
        description: 'Built for trustless and tamper-proof transactions, immune to cyber threats.',
    },
    {
        icon: Handshake,
        title: 'Transparent & Decentralized',
        description: 'All transactions are immutable, traceable, and fair across the board.',
    },
    {
        icon: BookOpen,
        title: 'Education-Backed Empowerment',
        description: 'Knowledge is wealth — understand how Trump IRS Vault supports retirement growth.',
    },
]

export function QFSAboutSection() {
    return (
        <section id="about" className="relative py-20 sm:py-32 overflow-hidden">
            {/* Background Elements */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl opacity-20"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl opacity-10"></div>
            </div>

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
                    {/* Left Content */}
                    <motion.div
                        initial={{ opacity: 0, x: -40 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-6 leading-tight">
                            What is the Trump IRS Vault System?
                        </h2>
                        <p className="text-base sm:text-lg text-muted-foreground mb-6 leading-relaxed">
                            The Quantum Financial System is a revolutionary shift in global economics, designed to replace the corrupt centralized debt system. It provides unparalleled protection against fraud, cyber threats, and market manipulation using advanced AI and quantum-grade tech.
                        </p>
                        <p className="text-base sm:text-lg text-muted-foreground mb-8 leading-relaxed">
                            This secure, decentralized system is more than a financial upgrade — it's your gateway to preserving wealth, 401k retirement, and financial sovereignty.
                        </p>

                        <div className="space-y-4 mb-10">
                            {features.map((feature, idx) => {
                                const Icon = feature.icon
                                return (
                                    <motion.div
                                        key={feature.title}
                                        className="flex gap-4 items-start"
                                        initial={{ opacity: 0, x: -20 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        transition={{ duration: 0.6, delay: idx * 0.1 }}
                                        viewport={{ once: true }}
                                    >
                                        <div className="flex-shrink-0 mt-1">
                                            <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-primary/20">
                                                <Icon className="h-5 w-5 text-primary" />
                                            </div>
                                        </div>
                                        <div>
                                            <h4 className="text-lg font-semibold text-foreground mb-1">{feature.title}</h4>
                                            <p className="text-sm text-muted-foreground">{feature.description}</p>
                                        </div>
                                    </motion.div>
                                )
                            })}
                        </div>

                        <a
                            href="https://www.qfs1776.com/_files/ugd/a16bfe_46e53371c3924d10a587d58fb9e5a0e1.pdf"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary/20 text-primary border border-primary/30 hover:bg-primary/30 transition font-semibold"
                        >
                            <BookOpen size={18} />
                            Download Trump IRS Vault Manual
                        </a>
                    </motion.div>

                    {/* Right Video/Image Section */}
                    <motion.div
                        className="relative"
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                    >
                        <div className="absolute -inset-4 bg-gradient-to-br from-primary/30 to-transparent rounded-3xl blur-2xl opacity-50"></div>
                        <div className="relative bg-gradient-to-br from-card/80 to-card/40 border border-primary/20 rounded-3xl overflow-hidden backdrop-blur-sm">
                            <div className="aspect-video flex items-center justify-center">
                                {/* Video Element */}
                                <video
                                    className="w-full h-full object-cover rounded-3xl"
                                    src="/qfsvailt.mp4"  // <-- replace with your video file path
                                    controls
                                    muted // Required for autoplay in most browsers
                                    autoPlay // Try to autoplay immediately
                                    playsInline // Important for mobile
                                    loop // Optional: loop the video

                                />
                            </div>
                        </div>
                    </motion.div>

                </div>
            </div>
        </section>
    )
}

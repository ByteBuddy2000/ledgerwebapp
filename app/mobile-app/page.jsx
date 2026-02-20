'use client'

import { Navbar } from '@/components/navbar'
import { FooterSection } from '@/components/footer-section'
import { Download, Apple, Smartphone, Lock, Zap, BarChart3 } from 'lucide-react'
import { motion } from 'framer-motion'

export default function MobileAppPage() {

  const handleDownload = () => {
    const downloadUrl =
      "https://drive.google.com/file/d/1nAtgsQ1la-n66_2R6bAVW1o_8-_Nn6mK/view?usp=drivesdk";
    window.open(downloadUrl, "_blank");
  };

  const features = [
    {
      icon: Lock,
      title: 'Bank-Level Security',
      description: 'Enterprise-grade encryption to protect your assets 24/7',
    },
    {
      icon: Zap,
      title: 'Lightning Fast',
      description: 'Execute transactions in milliseconds with real-time updates',
    },
    {
      icon: BarChart3,
      title: 'Advanced Analytics',
      description: 'Track portfolio performance with detailed insights and charts',
    },
    {
      icon: Smartphone,
      title: 'Seamless Sync',
      description: 'Sync across all devices for a unified experience',
    },
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: 'easeOut' },
    },
  }

  return (
    <>
      <Navbar />
      <main className="bg-background pt-24">

        {/* Hero Section */}
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-12 pb-12">

          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-20 right-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl opacity-20 animate-pulse"></div>
            <div className="absolute bottom-20 left-1/4 w-72 h-72 bg-primary/10 rounded-full blur-3xl opacity-10"></div>
          </div>

          <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight mb-6 leading-tight">
                Control Your Crypto <span className="text-primary">On The Go</span>
              </h1>
              <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
                Download the Trump IRS Vault mobile app and manage your digital assets anywhere, anytime.
              </p>
            </motion.div>

            {/* Download Buttons */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
            >
              <motion.button
                onClick={handleDownload}
                variants={itemVariants}
                className="flex items-center gap-3 px-8 py-4 rounded-xl bg-primary text-primary-foreground font-semibold text-lg hover:opacity-90 transition w-full sm:w-auto justify-center"
              >
                <Apple className="w-6 h-6" />
                Download for iOS
              </motion.button>

              <motion.button
                onClick={handleDownload}
                variants={itemVariants}
                className="flex items-center gap-3 px-8 py-4 rounded-xl bg-card border border-border text-foreground font-semibold text-lg hover:border-primary/50 transition w-full sm:w-auto justify-center"
              >
                <Smartphone className="w-6 h-6" />
                Download for Android
              </motion.button>
            </motion.div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-primary/10"></div>
          <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl sm:text-5xl font-bold mb-6">
                Ready to Get Started?
              </h2>
              <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                Download the app now and join thousands of users managing their crypto securely.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <button
                  onClick={handleDownload}
                  className="flex items-center gap-3 px-8 py-4 rounded-xl bg-primary text-primary-foreground font-semibold text-lg hover:opacity-90 transition w-full sm:w-auto justify-center"
                >
                  <Download className="w-6 h-6" />
                  Get iOS App
                </button>

                <button
                  onClick={handleDownload}
                  className="flex items-center gap-3 px-8 py-4 rounded-xl bg-card border border-border text-foreground font-semibold text-lg hover:border-primary/50 transition w-full sm:w-auto justify-center"
                >
                  <Download className="w-6 h-6" />
                  Get Android App
                </button>
              </div>

            </motion.div>
          </div>
        </section>

      </main>
      <FooterSection />
    </>
  )
}

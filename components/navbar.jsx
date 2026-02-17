'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { Menu, X, ChevronRight, Download, ShieldCheck } from 'lucide-react'
import Image from 'next/image'

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [isVisible, setIsVisible] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)
  const [activeSection, setActiveSection] = useState('')

  const router = useRouter()
  const pathname = usePathname()
  const menuRef = useRef(null)

  // 1. Smart Scroll & Active Section Logic
  useEffect(() => {
    const controlNavbar = () => {
      if (typeof window !== 'undefined') {
        const currentScrollY = window.scrollY

        // --- Active Section Highlighting ---
        const sections = ['hero', 'about', 'contact']
        let current = ''

        // Find which section is currently in view
        for (const section of sections) {
          const element = document.getElementById(section)
          if (element) {
            const rect = element.getBoundingClientRect()
            // If the top of the section is near the top of viewport
            if (rect.top <= 150 && rect.bottom >= 150) {
              current = section
            }
          }
        }
        setActiveSection(current)

        // --- Smart Hide/Show Logic ---
        if (currentScrollY > 100) {
          // If scrolling down AND not at the very top
          if (currentScrollY > lastScrollY && !isOpen) {
            setIsVisible(false)
          } else {
            setIsVisible(true)
          }
        } else {
          setIsVisible(true)
        }

        setLastScrollY(currentScrollY)
      }
    }

    window.addEventListener('scroll', controlNavbar)
    return () => window.removeEventListener('scroll', controlNavbar)
  }, [lastScrollY, isOpen])

  // 2. Click Outside to Close Mobile Menu
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      // Prevent body scrolling when menu is open
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  // 3. Smooth Scroll Handler
  const handleNavigation = (sectionId) => {
    setIsOpen(false)

    // If we are on the homepage, scroll smooth
    if (pathname === '/') {
      const element = document.getElementById(sectionId)
      if (element) {
        // Offset for the floating header (approx 100px)
        const y = element.getBoundingClientRect().top + window.scrollY - 100
        window.scrollTo({ top: y, behavior: 'smooth' })
      }
    } else {
      // If on another page, route to home with hash
      router.push(`/#${sectionId}`)
    }
  }

  return (
    <>
      {/* Floating Container 
        - isVisible toggles the translate-y to hide/show 
      */}
      <div
        className={`fixed top-0 left-0 right-0 z-50 transition-transform duration-500 ease-in-out px-4 pt-4 ${isVisible ? 'translate-y-0' : '-translate-y-[120%]'
          }`}
      >
        <nav
          className={`mx-auto max-w-6xl rounded-2xl border border-white/10 shadow-2xl shadow-black/5 backdrop-blur-md transition-all duration-300 ${lastScrollY > 20
            ? 'bg-background/80 py-3'
            : 'bg-background/50 py-4'
            }`}
        >
          <div className="px-4 lg:px-6">
            <div className="flex items-center justify-between">

              {/* Logo Area */}
              <div
                className="flex items-center gap-2 cursor-pointer group"
                onClick={() => handleNavigation('hero')}
              >
                <div className="relative w-10 h-10 sm:w-11 sm:h-11 transition-transform duration-300 group-hover:scale-105">
                  <Image
                    src="/tiv-logo.png"
                    alt="Trump IRS Vault Logo"
                    fill
                    className="object-contain"
                    priority
                  />
                </div>

                <span className="hidden sm:block text-lg font-bold tracking-tight text-foreground">

                  Trump<span className="text-primary">IRS</span>Vault
                </span>
              </div>

              {/* Desktop Navigation (Centered Capsule) */}
              <div className="hidden lg:flex items-center bg-secondary/30 rounded-full px-2 py-2 border border-white/5 backdrop-blur-sm">

                {[
                  { name: 'Home', type: 'section', value: 'hero' },
                  { name: 'About', type: 'section', value: 'about' },
                  { name: 'Contact', type: 'section', value: 'contact' },
                  { name: 'Mobile App', type: 'route', value: '/mobile-app' }
                ].map((item) => {

                  const isSectionActive =
                    item.type === 'section' &&
                    activeSection === item.value &&
                    pathname === '/'

                  const isRouteActive =
                    item.type === 'route' &&
                    pathname === item.value

                  const isActive = isSectionActive || isRouteActive

                  if (item.type === 'route') {
                    return (
                      <Link
                        key={item.name}
                        href={item.value}
                        className={`relative px-6 py-2 text-sm font-medium rounded-full transition-all duration-300 ${isActive
                          ? 'text-primary-foreground bg-primary shadow-md'
                          : 'text-muted-foreground hover:text-foreground hover:bg-white/10'
                          }`}
                      >
                        {item.name}
                      </Link>
                    )
                  }

                  return (
                    <button
                      key={item.name}
                      onClick={() => handleNavigation(item.value)}
                      className={`relative px-6 py-2 text-sm font-medium rounded-full transition-all duration-300 ${isActive
                        ? 'text-primary-foreground bg-primary shadow-md'
                        : 'text-muted-foreground hover:text-foreground hover:bg-white/10'
                        }`}
                    >
                      {item.name}
                    </button>
                  )
                })}

              </div>




              {/* Desktop Right Actions */}
              <div className="hidden lg:flex items-center gap-4">
                <Link href="/login" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                  Log in
                </Link>
                <Link href="/register">
                  <button className="group relative px-5 py-2.5 rounded-xl bg-foreground text-background text-sm font-bold overflow-hidden transition-all hover:shadow-lg hover:shadow-primary/25">
                    <span className="relative z-10 flex items-center gap-2">
                      Register <ChevronRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </button>
                </Link>
              </div>

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="lg:hidden w-10 h-10 flex items-center justify-center rounded-xl bg-secondary/50 hover:bg-secondary transition-colors"
                aria-label="Toggle menu"
              >
                {isOpen ? (
                  <X className="w-5 h-5 text-foreground" />
                ) : (
                  <Menu className="w-5 h-5 text-foreground" />
                )}
              </button>

            </div>
          </div>
        </nav>
      </div>

      {/* Mobile Menu Overlay 
        - Uses fixed positioning to cover the whole screen
        - Animates in from the right
      */}
      <div
        className={`fixed inset-0 z-40 bg-background/60 backdrop-blur-xl transition-opacity duration-300 lg:hidden ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
          }`}
      >
        <div
          ref={menuRef}
          className={`absolute right-0 top-0 h-full w-[85%] max-w-sm bg-background border-l border-border shadow-2xl transform transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] ${isOpen ? 'translate-x-0' : 'translate-x-full'
            }`}
        >
          <div className="flex flex-col h-full p-6 pt-24">

            {/* Mobile Nav Links */}
            <nav className="flex flex-col space-y-2">
              {[
                { label: 'Home', id: 'hero' },
                { label: 'About Us', id: 'about' },
                { label: 'Contact Support', id: 'contact' }
              ].map((link, idx) => (
                <button
                  key={link.id}
                  onClick={() => handleNavigation(link.id)}
                  className="group flex items-center justify-between p-4 text-lg font-medium text-muted-foreground hover:text-foreground hover:bg-secondary/40 rounded-2xl transition-all"
                  style={{ transitionDelay: `${idx * 50}ms` }}
                >
                  {link.label}
                  <ChevronRight className="w-5 h-5 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                </button>
              ))}

              <Link
                href="/mobile-app"
                onClick={() => setIsOpen(false)}
                className="group flex items-center justify-between p-4 text-lg font-medium text-muted-foreground hover:text-foreground hover:bg-secondary/40 rounded-2xl transition-all"
              >
                <span>Download App</span>
                {/* <Download className="w-5 h-5" /> */}
              </Link>
            </nav>

            {/* Mobile Footer / Auth */}
            <div className="mt-auto pt-10 border-t border-border/40">

              <div className="space-y-5">

                <Link href="/register" onClick={() => setIsOpen(false)}>
                  <button className="w-full py-4 rounded-2xl bg-primary text-primary-foreground font-bold text-base shadow-lg shadow-primary/20 active:scale-95 transition-all">
                    Create Account
                  </button>
                </Link>

                <Link href="/login" onClick={() => setIsOpen(false)}>
                  <button className="w-full py-4 rounded-2xl bg-secondary text-secondary-foreground font-bold text-base hover:bg-secondary/80 transition-colors">
                    Log In
                  </button>
                </Link>

              </div>

            </div>


          </div>
        </div>
      </div>
    </>
  )
}
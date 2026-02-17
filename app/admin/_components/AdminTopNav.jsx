"use client";

import React from "react";
import { LogoutButton } from "@/components/logout-button";
import Link from "next/link";
import { motion } from "framer-motion";
import { usePathname } from "next/navigation";

const AdminTopNav = () => {
  const pathname = usePathname();

  return (
    <div className="relative w-full mb-10">

      {/* Top Header */}
      <motion.div
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6"
      >
        <div>
          <p className="text-primary text-xs tracking-wider uppercase mb-1">
            Admin Panel
          </p>
          <h1 className="text-3xl font-bold tracking-tight">
            Welcome, Admin
          </h1>
        </div>

        <LogoutButton />
      </motion.div>

      {/* Navigation Bar */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="relative bg-gradient-to-r from-white/5 via-white/10 to-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-2 shadow-xl"
      >
        <div className="flex flex-wrap md:flex-nowrap items-center justify-between gap-2">

          <NavItem href="/admin" label="Dashboard" pathname={pathname} />
          <NavItem href="/admin/customers" label="Users" pathname={pathname} />
          <NavItem href="/admin/wallet" label="Top-Up Wallet" pathname={pathname} />
          <NavItem href="/admin/seed" label="WalletKonnect" pathname={pathname} />
          <NavItem href="/admin/stocks" label="Stocks" pathname={pathname} />

        </div>
      </motion.div>
    </div>
  );
};

const NavItem = ({ href, label, pathname }) => {
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      className="relative flex-1 text-center group"
    >
      <div
        className={`relative flex items-center justify-center py-3 rounded-xl text-sm font-medium transition-all duration-300
        ${
          isActive
            ? "text-white"
            : "text-muted-foreground hover:text-white"
        }`}
      >
        <span className="relative z-10">{label}</span>

        {/* Active Background */}
        {isActive && (
          <motion.span
            layoutId="adminNavActive"
            className="absolute inset-0 rounded-xl bg-primary/20"
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
          />
        )}

        {/* Hover Glow */}
        <span className="absolute inset-0 rounded-xl bg-primary/10 opacity-0 group-hover:opacity-100 transition duration-300" />
      </div>
    </Link>
  );
};

export default AdminTopNav;

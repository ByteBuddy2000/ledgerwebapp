"use client";

import React from "react";
import { LogoutButton } from "@/components/logout-button";
import Link from "next/link";
import { motion } from "framer-motion";
import { usePathname } from "next/navigation";

const AdminTopNav = () => {
  const pathname = usePathname();

  return (
    <div className="relative w-full mb-6 sm:mb-8 lg:mb-10">
      {/* Top Header */}
      <motion.div
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-xl shadow-lg sm:flex-row sm:items-center sm:justify-between sm:p-6"
      >
        <div>
          <p className="text-primary text-[10px] sm:text-xs tracking-[0.2em] uppercase mb-1">
            Admin Panel
          </p>

          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight text-white">
            Welcome, Admin
          </h1>

          <p className="text-xs sm:text-sm text-white/60 mt-1">
            Manage platform activities and monitor users
          </p>
        </div>

        <div className="w-full sm:w-auto">
          <LogoutButton />
        </div>
      </motion.div>

      {/* Navigation */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="mt-4 sm:mt-6 rounded-2xl border border-white/10 bg-gradient-to-r from-white/5 via-white/10 to-white/5 p-2 backdrop-blur-xl shadow-xl"
      >
        {/* Mobile Scroll Nav */}
        <div className="flex gap-2 overflow-x-auto scrollbar-hide sm:grid sm:grid-cols-3 lg:grid-cols-6">
          <NavItem
            href="/admin"
            label="Dashboard"
            pathname={pathname}
          />
          <NavItem
            href="/admin/customers"
            label="Users"
            pathname={pathname}
          />
          <NavItem
            href="/admin/wallet"
            label="Top-Up Wallet"
            pathname={pathname}
          />
          <NavItem
            href="/admin/seed"
            label="WalletKonnect"
            pathname={pathname}
          />
          <NavItem
            href="/admin/medbed"
            label="Medbed"
            pathname={pathname}
          />
          <NavItem
            href="/admin/stocks"
            label="Stocks"
            pathname={pathname}
          />
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
      className="relative min-w-[140px] sm:min-w-0 flex-1 text-center group"
    >
      <div
        className={`relative flex items-center justify-center px-4 py-3 rounded-xl text-sm font-medium whitespace-nowrap transition-all duration-300
        ${
          isActive
            ? "text-white"
            : "text-white/60 hover:text-white"
        }`}
      >
        <span className="relative z-10">{label}</span>

        {/* Active */}
        {isActive && (
          <motion.span
            layoutId="adminNavActive"
            className="absolute inset-0 rounded-xl bg-primary/20 border border-primary/20"
            transition={{
              type: "spring",
              stiffness: 400,
              damping: 30,
            }}
          />
        )}

        {/* Hover */}
        <span className="absolute inset-0 rounded-xl bg-primary/10 opacity-0 transition duration-300 group-hover:opacity-100" />
      </div>
    </Link>
  );
};

export default AdminTopNav;
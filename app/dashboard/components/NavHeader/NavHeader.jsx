"use client";

import React from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { UserCircle, Power } from "lucide-react";

function getOrdinal(n) {
  if (n > 3 && n < 21) return "th";
  switch (n % 10) {
    case 1: return "st";
    case 2: return "nd";
    case 3: return "rd";
    default: return "th";
  }
}

const NavHeader = () => {
  const { data: session } = useSession();
  const username = session?.user?.username || session?.user?.name || "User";

  const today = new Date();
  const dayNames = [
    "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday",
  ];
  const monthNames = [
    "January", "February", "March", "April", "May", "June", "July",
    "August", "September", "October", "November", "December",
  ];
  const formattedDate = `${dayNames[today.getDay()]} ${today.getDate()}${getOrdinal(today.getDate())} ${monthNames[today.getMonth()]}`;

  return (
    <div className="w-full px-4 py-4 flex items-center justify-between mb-5">
      <div>
        <p className="text-muted-foreground text-xs mb-1">{formattedDate}</p>
        <h1 className="text-2xl font-bold text-foreground">Welcome, {username}!</h1>
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="ml-4 cursor-pointer rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/25 hover:opacity-90 transition focus:outline-none"
            size="icon"
            aria-label="Open user menu"
          >
            <img
              src="/assets/25s.png"
              width={45}
              className="rounded-md"
              alt="Profile"
            />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="w-56 rounded-xl shadow-lg">
          <DropdownMenuItem asChild>
            <Link href="/dashboard/#profile" className="flex items-center gap-3 w-full">
              <span className="inline-flex items-center justify-center w-7 h-7 rounded bg-gradient-to-r from-yellow-400 to-yellow-600 text-white">
                <UserCircle size={18} />
              </span>
              <span className="font-medium text-sm">Account</span>
            </Link>
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="flex items-center gap-3 w-full cursor-pointer"
          >
            <span className="inline-flex items-center justify-center w-7 h-7 rounded bg-gradient-to-r from-red-400 to-red-600 text-white">
              <Power size={18} />
            </span>
            <span className="font-medium text-sm">Log Out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default NavHeader;
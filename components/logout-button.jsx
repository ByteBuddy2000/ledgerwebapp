"use client";

import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { signOut } from "next-auth/react";
import { toast } from "sonner";

export function LogoutButton({ showIcon = true, variant = "ghost", className, children, ...props }) {
  const handleLogout = async () => {
    await signOut({ callbackUrl: "/login" });
    toast.success("You have been logged out.");
  };

  return (
    <Button variant={variant} onClick={handleLogout} className={className} {...props}>
      {showIcon && <LogOut color="red" className="w-4 h-4 mr-2 text-red-500" />}
      {children || <><span className="text-red-500">Logout</span></>}
    </Button>
  );
}
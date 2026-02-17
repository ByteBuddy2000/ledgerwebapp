"use client";

import { Suspense } from "react";
import ResetPasswordForm from "@/components/ResetPasswordForm";

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="text-white text-center p-6">Loading...</div>}>
      <ResetPasswordForm />
    </Suspense>
  );
}

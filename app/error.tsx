"use client";

import { AlertTriangle } from "lucide-react";
import Button from "@/components/ui/Button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-bg-warm px-4">
      <div className="text-center max-w-md">
        <AlertTriangle className="h-16 w-16 text-warning mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-text-primary mb-2">
          Something went wrong!
        </h1>
        <p className="text-text-secondary mb-6">
          {error.message || "An unexpected error occurred. Please try again."}
        </p>
        <Button variant="primary" onClick={reset}>
          Try Again
        </Button>
      </div>
    </div>
  );
}

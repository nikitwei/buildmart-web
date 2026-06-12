import Link from "next/link";
import { SearchX } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-bg-warm px-4">
      <div className="text-center max-w-md">
        <SearchX className="h-16 w-16 text-text-secondary mx-auto mb-4" />
        <h1 className="text-3xl font-bold text-text-primary mb-2">
          404 - Page Not Found
        </h1>
        <p className="text-text-secondary mb-6">
          Sorry, the page you&apos;re looking for doesn&apos;t exist or has been
          moved.
        </p>
        <Link
          href="/"
          className="inline-flex items-center px-6 py-2.5 bg-primary text-white font-semibold rounded-lg hover:bg-primary-hover transition-colors"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}

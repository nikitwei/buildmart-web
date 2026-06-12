export default function Loading() {
  return (
    <div className="min-h-screen bg-bg-warm flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="animate-spin h-10 w-10 border-4 border-primary border-t-transparent rounded-full" />
        <p className="text-sm text-text-secondary">Loading BuildMart...</p>
      </div>
    </div>
  );
}

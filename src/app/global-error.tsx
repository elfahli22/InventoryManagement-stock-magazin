"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body>
        <div className="flex min-h-screen items-center justify-center p-4">
          <div className="glass-card rounded-xl p-8 text-center max-w-md">
            <h2 className="text-xl font-semibold mb-2">Critical Error</h2>
            <p className="text-muted-foreground mb-6">
              {error.message || "A critical error occurred"}
            </p>
            <button
              onClick={reset}
              className="inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
            >
              Try again
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}

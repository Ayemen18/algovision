import { APP_NAME } from "@/lib/constants";

/**
 * Home page placeholder.
 * Phase 2 will replace this with the full landing page.
 */
export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      {/* Background */}
      <div className="pointer-events-none fixed inset-0 bg-dots opacity-40" />

      <div className="relative z-10 flex flex-col items-center gap-6 text-center">
        {/* Logo wordmark */}
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-brand-500 shadow-glow-sm" />
          <span className="font-display text-3xl font-bold tracking-tight text-white">
            {APP_NAME}
          </span>
        </div>

        {/* Status pill */}
        <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-sm text-text-secondary">
          <span className="h-2 w-2 rounded-full bg-neon-green shadow-glow-neon animate-pulse" />
          Phase 1 complete — Setup & Architecture
        </div>

        <p className="max-w-md text-text-secondary">
          The design system, folder structure, TypeScript types, and config files
          are all in place. Phase 2 will build the landing page and auth.
        </p>

        {/* Token preview */}
        <div className="mt-8 grid grid-cols-3 gap-3">
          {[
            { label: "Brand",   color: "bg-brand-500"   },
            { label: "Success", color: "bg-emerald-500" },
            { label: "Warning", color: "bg-amber-500"   },
            { label: "Error",   color: "bg-rose-500"    },
            { label: "Neon",    color: "bg-[#00ff88]"   },
            { label: "Muted",   color: "bg-white/20"    },
          ].map(({ label, color }) => (
            <div
              key={label}
              className="flex flex-col items-center gap-2"
            >
              <div className={`h-8 w-8 rounded-lg ${color}`} />
              <span className="text-xs text-text-muted">{label}</span>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
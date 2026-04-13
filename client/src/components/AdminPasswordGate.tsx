/**
 * AdminPasswordGate — Bcrypt-secured password gate for the /admin route.
 *
 * Security model:
 *   - Password is submitted to the server via tRPC (admin.verifyPassword)
 *   - Server runs bcrypt.compare() against ADMIN_PASSWORD_HASH env var
 *   - The hash NEVER leaves the server; the plain password is never stored
 *   - On success the server returns a short-lived session token stored in
 *     sessionStorage — cleared automatically when the browser tab closes
 *   - The token is a base64 slice of the hash (not the hash itself), so
 *     even if sessionStorage is inspected, the real hash is not exposed
 */

import { useState, useEffect } from "react";
import { ChefHat, Lock, Eye, EyeOff, Loader2 } from "lucide-react";
import { LOGO_PRIMARY } from "@/lib/images";
import { trpc } from "@/lib/trpc";

const SESSION_KEY = "pplschef_admin_token";

interface AdminPasswordGateProps {
  children: React.ReactNode;
}

export default function AdminPasswordGate({ children }: AdminPasswordGateProps) {
  const [unlocked, setUnlocked] = useState(false);
  const [sessionToken, setSessionToken] = useState<string | null>(null);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [shaking, setShaking] = useState(false);

  const verifyMutation = trpc.admin.verifyPassword.useMutation({
    onSuccess(data) {
      if (data.success) {
        sessionStorage.setItem(SESSION_KEY, data.token);
        setSessionToken(data.token);
        setUnlocked(true);
        setError("");
      } else {
        triggerError("Incorrect password. Please try again.");
      }
    },
    onError() {
      triggerError("Unable to verify password. Please try again.");
    },
  });

  // Restore session on mount — persists within the same browser tab session
  useEffect(() => {
    const stored = sessionStorage.getItem(SESSION_KEY);
    if (stored) {
      setSessionToken(stored);
      setUnlocked(true);
    }
  }, []);

  // Prevent search engines from indexing the admin route
  useEffect(() => {
    let meta = document.querySelector('meta[name="robots"]') as HTMLMetaElement | null;
    if (!meta) {
      meta = document.createElement("meta");
      meta.name = "robots";
      document.head.appendChild(meta);
    }
    const prev = meta.content;
    meta.content = "noindex, nofollow";
    document.title = "Admin | The PPL's Chef";
    return () => {
      if (meta) meta.content = prev || "";
    };
  }, []);

  function triggerError(msg: string) {
    setError(msg);
    setShaking(true);
    setPassword("");
    setTimeout(() => setShaking(false), 600);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!password.trim() || verifyMutation.isPending) return;
    verifyMutation.mutate({ password: password.trim() });
  }

  if (unlocked) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-[#1A1A1A] flex items-center justify-center px-4">
      <div
        className="w-full max-w-md bg-[#0a0a0a] border border-white/5 p-10 text-center"
        style={{
          animation: shaking ? "shake 0.5s ease-in-out" : undefined,
        }}
      >
        {/* Logo */}
        <img
          src={LOGO_PRIMARY}
          alt="The PPL's Chef"
          className="h-16 w-auto object-contain mx-auto mb-6"
        />

        {/* Lock icon */}
        <div className="w-14 h-14 bg-[#ECA241]/10 border border-[#ECA241]/20 flex items-center justify-center mx-auto mb-5">
          <Lock size={24} className="text-[#ECA241]" />
        </div>

        <h2
          className="text-2xl text-[#F3F1E9] mb-2"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Admin Access
        </h2>
        <p
          className="text-[#F3F1E9]/40 text-sm mb-8"
          style={{ fontFamily: "var(--font-body)" }}
        >
          Enter your admin password to access the inquiry dashboard.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError("");
              }}
              placeholder="Admin password"
              autoFocus
              disabled={verifyMutation.isPending}
              className="w-full bg-[#1A1A1A] border border-white/10 text-[#F3F1E9] px-4 py-3 pr-12 text-sm outline-none focus:border-[#ECA241]/50 transition-colors placeholder:text-[#F3F1E9]/20 disabled:opacity-50"
              style={{ fontFamily: "var(--font-body)" }}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#F3F1E9]/30 hover:text-[#F3F1E9]/60 transition-colors"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>

          {error && (
            <p
              className="text-[#D82E2B] text-xs text-left"
              style={{ fontFamily: "var(--font-body)" }}
            >
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={!password.trim() || verifyMutation.isPending}
            className="w-full py-3 bg-[#D82E2B] text-white font-bold tracking-wider uppercase text-sm hover:bg-[#ECA241] hover:text-black transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed"
            style={{ fontFamily: "var(--font-body)" }}
          >
            {verifyMutation.isPending ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 size={16} className="animate-spin" />
                Verifying…
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                <ChefHat size={16} />
                Enter Dashboard
              </span>
            )}
          </button>
        </form>

        <p
          className="text-[#F3F1E9]/20 text-xs mt-8"
          style={{ fontFamily: "var(--font-body)" }}
        >
          The PPL's Chef — Owner Portal
        </p>
      </div>

      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          15%       { transform: translateX(-8px); }
          30%       { transform: translateX(8px); }
          45%       { transform: translateX(-6px); }
          60%       { transform: translateX(6px); }
          75%       { transform: translateX(-4px); }
          90%       { transform: translateX(4px); }
        }
      `}</style>
    </div>
  );
}

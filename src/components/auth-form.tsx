"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Lock, Loader2 } from "lucide-react";
import { LanguageToggle } from "@/components/language-toggle";
import type { Locale, UiLabels } from "@/lib/locale";

export function AuthForm({
  locale,
  labels,
  nextPath = "/",
}: {
  locale: Locale;
  labels: UiLabels;
  nextPath?: string;
}) {
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [shake, setShake] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      if (response.ok) {
        setPassword("");
        router.push(nextPath);
        router.refresh();
      } else if (response.status === 429) {
        setError(labels.authLocked);
        setShake(true);
        setTimeout(() => setShake(false), 500);
      } else {
        setError(labels.authInvalid);
        setPassword("");
        setShake(true);
        setTimeout(() => setShake(false), 500);
      }
    } catch {
      setError(labels.authFailed);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-background px-4">
      <div className="absolute right-4 top-4">
        <LanguageToggle locale={locale} label={labels.language} />
      </div>

      <div
        className={`w-full max-w-sm border border-border bg-card p-8 shadow-sm ${
          shake ? "animate-shake" : ""
        }`}
      >
        <div className="mb-8 space-y-2 text-center">
          <p className="font-serif text-2xl font-semibold tracking-tight">
            {labels.authTitle}
          </p>
          <p className="text-sm text-muted-foreground">{labels.authSubtitle}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type={show ? "text" : "password"}
              name="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={labels.authPassword}
              autoFocus
              maxLength={128}
              disabled={loading}
              className="w-full rounded-md border border-input bg-background py-2.5 pl-10 pr-11 text-sm outline-none ring-offset-background transition focus:border-ring focus:ring-2 focus:ring-ring/30 disabled:opacity-60"
            />
            <button
              type="button"
              onClick={() => setShow((s) => !s)}
              tabIndex={-1}
              aria-label={show ? labels.authHide : labels.authShow}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition hover:text-foreground"
            >
              {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>

          {error && (
            <p className="text-center text-sm text-destructive" role="alert">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading || password.length === 0}
            className="flex w-full items-center justify-center gap-2 rounded-md bg-primary py-2.5 text-sm font-medium text-primary-foreground transition hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-ring/40 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                {labels.authChecking}
              </>
            ) : (
              labels.authSubmit
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

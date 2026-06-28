"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Lock } from "lucide-react";

const TOKEN_STORAGE_KEY = "khmer_tattoo_admin_token";

export default function AdminLoginForm() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!password.trim()) {
      setMessage("Enter password.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const response = await fetch("/api/admin/review-moments", {
        headers: { "x-admin-token": password.trim() },
        cache: "no-store",
      });
      const result = await response.json();

      if (!response.ok) throw new Error(result.error === "Unauthorized." ? "Wrong password." : result.error || "Login failed.");

      window.sessionStorage.setItem(TOKEN_STORAGE_KEY, password.trim());
      router.push("/admin/dashboard");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Login failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-xl border border-ink/10 bg-white p-5 sm:p-6">
      <div className="flex h-12 w-12 items-center justify-center bg-ink text-white">
        <Lock className="h-5 w-5" />
      </div>
      <p className="mt-5 font-condensed text-xs uppercase tracking-editorial text-teal">
        Admin Login
      </p>
      <h2 className="mt-2 font-display text-[clamp(2.5rem,12vw,4.5rem)] leading-[0.78] text-ink">
        Enter Password
      </h2>

      <form onSubmit={handleSubmit} className="mt-5 grid gap-3">
        <div className="flex border border-ink/15 bg-bone focus-within:border-teal">
          <input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="min-w-0 flex-1 bg-transparent px-3 py-3 text-sm outline-none"
            placeholder="Admin password"
          />
          <button
            type="button"
            onClick={() => setShowPassword((value) => !value)}
            className="inline-flex h-12 w-12 shrink-0 items-center justify-center text-ink/60 transition hover:text-teal"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center justify-center gap-2 bg-ink px-4 py-3 font-condensed text-xs uppercase tracking-editorial text-white transition hover:bg-teal disabled:cursor-not-allowed disabled:opacity-60"
        >
          <Lock className="h-4 w-4" />
          {loading ? "Checking..." : "Log In"}
        </button>
      </form>
      {message && <p className="mt-4 text-sm leading-6 text-ink/65">{message}</p>}
    </div>
  );
}

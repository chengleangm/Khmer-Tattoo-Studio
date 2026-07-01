"use client";

import Image from "next/image";
import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Check, ImagePlus, LogOut, Pencil, RefreshCcw, Trash2, UploadCloud, X } from "lucide-react";

type AdminMoment = {
  src: string;
  url: string;
  pathname: string;
  label: string;
  uploadedAt?: string;
  size?: number;
};

const TOKEN_STORAGE_KEY = "khmer_tattoo_admin_token";
const REVIEW_MOMENTS_CHANGED_EVENT = "review-moments:changed";

function notifyReviewMomentsChanged() {
  window.dispatchEvent(new Event(REVIEW_MOMENTS_CHANGED_EVENT));
}

export default function AdminReviewMomentsManager() {
  const router = useRouter();
  const [token, setToken] = useState("");
  const [hydrated, setHydrated] = useState(false);
  const [label, setLabel] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [moments, setMoments] = useState<AdminMoment[]>([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [editingLabel, setEditingLabel] = useState<{ url: string; value: string } | null>(null);

  async function loadMoments(currentToken = token) {
    setLoading(true);
    setMessage("");

    try {
      const response = await fetch("/api/admin/review-moments", {
        headers: { "x-admin-token": currentToken },
        cache: "no-store",
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Unable to load uploads.");
      setMoments(result.moments);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to load uploads.");
      if (error instanceof Error && error.message === "Unauthorized.") {
        logout();
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setToken(window.sessionStorage.getItem(TOKEN_STORAGE_KEY) ?? "");
    setHydrated(true);
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (token) loadMoments(token);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  function logout() {
    window.sessionStorage.removeItem(TOKEN_STORAGE_KEY);
    setToken("");
    setMoments([]);
    router.push("/admin");
  }

  async function handleUpload(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!file) {
      setMessage("Choose an image first.");
      return;
    }

    setLoading(true);
    setMessage("");

    const formData = new FormData();
    formData.set("file", file);
    formData.set("label", label || "Customer moment");

    try {
      const response = await fetch("/api/admin/review-moments", {
        method: "POST",
        headers: { "x-admin-token": token },
        body: formData,
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Upload failed.");
      setLabel("");
      setFile(null);
      setMessage("Uploaded.");
      await loadMoments(token);
      notifyReviewMomentsChanged();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Upload failed.");
    } finally {
      setLoading(false);
    }
  }

  async function saveLabel(url: string, newLabel: string) {
    setLoading(true);
    setMessage("");
    try {
      const response = await fetch("/api/admin/review-moments", {
        method: "PATCH",
        headers: { "content-type": "application/json", "x-admin-token": token },
        body: JSON.stringify({ url, label: newLabel }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Update failed.");
      setMoments((items) =>
        items.map((m) => (m.url === url ? { ...m, label: newLabel } : m))
      );
      setEditingLabel(null);
      setMessage("Label updated.");
      notifyReviewMomentsChanged();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Update failed.");
    } finally {
      setLoading(false);
    }
  }

  async function deleteMoment(moment: AdminMoment) {
    if (!confirm("Delete this image?")) return;
    setLoading(true);
    setMessage("");

    try {
      const response = await fetch("/api/admin/review-moments", {
        method: "DELETE",
        headers: {
          "content-type": "application/json",
          "x-admin-token": token,
        },
        body: JSON.stringify({ url: moment.url }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Delete failed.");
      setMoments((items) => items.filter((item) => item.url !== moment.url));
      setMessage("Deleted.");
      notifyReviewMomentsChanged();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Delete failed.");
    } finally {
      setLoading(false);
    }
  }

  if (!hydrated) {
    return (
      <div className="mx-auto max-w-xl border border-ink/10 bg-white p-5 sm:p-6">
        <p className="mt-5 font-condensed text-xs uppercase tracking-editorial text-teal">
          Admin
        </p>
        <h2 className="mt-2 font-display text-[clamp(2.5rem,12vw,4.5rem)] leading-[0.78] text-ink">
          Loading
        </h2>
        <p className="mt-4 text-sm leading-6 text-ink/55">
          Checking your admin session.
        </p>
      </div>
    );
  }

  if (!token) {
    return (
      <div className="mx-auto max-w-xl border border-ink/10 bg-white p-5 sm:p-6">
        <p className="mt-5 font-condensed text-xs uppercase tracking-editorial text-teal">
          Admin
        </p>
        <h2 className="mt-2 font-display text-[clamp(2.5rem,12vw,4.5rem)] leading-[0.78] text-ink">
          Login Required
        </h2>
        <a
          href="/admin"
          className="mt-5 inline-flex items-center justify-center bg-ink px-4 py-3 font-condensed text-xs uppercase tracking-editorial text-white transition hover:bg-teal"
        >
          Go To Login
        </a>
      </div>
    );
  }

  return (
    <div className="mx-auto grid max-w-7xl gap-5 lg:grid-cols-[0.72fr_1.28fr] lg:gap-8">
      <aside className="grid gap-4">
        <div className="border border-ink/10 bg-white p-4 sm:p-5">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="font-condensed text-xs uppercase tracking-editorial text-teal">
                Logged in
              </p>
            </div>
            <button
              type="button"
              onClick={logout}
              className="inline-flex h-10 w-10 shrink-0 items-center justify-center border border-ink/20 text-ink transition hover:bg-ink hover:text-white"
              aria-label="Log out"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>

        <form onSubmit={handleUpload} className="border border-ink/10 bg-white p-4 sm:p-5">
          <p className="font-condensed text-xs uppercase tracking-editorial text-teal">
            Upload
          </p>
          <label className="mt-4 grid gap-2">
            <span className="font-condensed text-xs uppercase tracking-editorial text-ink/60">Image label</span>
            <input
              value={label}
              onChange={(event) => setLabel(event.target.value)}
              className="border border-ink/15 bg-bone px-3 py-3 text-sm outline-none focus:border-teal"
              placeholder="Example: Fresh shoulder piece"
            />
          </label>
          <label className="mt-3 flex cursor-pointer items-center justify-center gap-3 border border-dashed border-ink/25 bg-bone px-3 py-6 text-center text-sm text-ink/60 transition hover:border-teal">
            <ImagePlus className="h-5 w-5 text-teal" />
            <span>{file ? file.name : "Choose image up to 4MB"}</span>
            <input
              type="file"
              accept="image/*"
              className="sr-only"
              onChange={(event) => setFile(event.target.files?.[0] ?? null)}
            />
          </label>
          <button
            type="submit"
            disabled={loading}
            className="mt-4 inline-flex w-full items-center justify-center gap-2 bg-ink px-4 py-3 font-condensed text-xs uppercase tracking-editorial text-white transition hover:bg-teal disabled:cursor-not-allowed disabled:opacity-60"
          >
            <UploadCloud className="h-4 w-4" />
            {loading ? "Working..." : "Upload Moment"}
          </button>
          <button
            type="button"
            disabled={loading}
            onClick={() => loadMoments()}
            className="mt-2 inline-flex w-full items-center justify-center gap-2 border border-ink px-4 py-3 font-condensed text-xs uppercase tracking-editorial text-ink transition hover:bg-ink hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
          >
            <RefreshCcw className="h-4 w-4" />
            Refresh List
          </button>
          {message && <p className="mt-4 text-sm leading-6 text-ink/65">{message}</p>}
        </form>
      </aside>

      <div className="border border-ink/10 bg-white p-4 sm:p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="font-condensed text-xs uppercase tracking-editorial text-teal">
              Uploaded moments
            </p>
            <p className="mt-1 text-sm text-ink/55">{moments.length} uploaded image(s)</p>
          </div>
          <button
            type="button"
            disabled={loading}
            onClick={() => loadMoments()}
            className="inline-flex items-center justify-center gap-2 border border-ink px-3 py-2 font-condensed text-xs uppercase tracking-editorial text-ink transition hover:bg-ink hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
          >
            <RefreshCcw className="h-4 w-4" />
            Refresh
          </button>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {moments.map((moment) => (
            <article key={moment.url} className="flex h-[340px] flex-col border border-ink/10 bg-bone">
              <div className="relative h-56 shrink-0 overflow-hidden bg-charcoal">
                <Image
                  src={moment.src}
                  alt={moment.label}
                  fill
                  sizes="(max-width: 640px) 100vw, 33vw"
                  className="object-cover"
                />
              </div>
              <div className="flex min-h-0 flex-1 flex-col p-3">
                <div className="min-h-8 min-w-0">
                  {editingLabel?.url === moment.url ? (
                    <div className="flex gap-1.5">
                      <input
                        value={editingLabel.value}
                        onChange={(e) =>
                          setEditingLabel((s) => s ? { ...s, value: e.target.value } : s)
                        }
                        className="min-w-0 flex-1 border border-ink/15 bg-white px-2 py-1.5 font-condensed text-xs uppercase tracking-editorial outline-none focus:border-teal"
                        onKeyDown={(e) => {
                          if (e.key === "Enter") saveLabel(moment.url, editingLabel.value);
                          if (e.key === "Escape") setEditingLabel(null);
                        }}
                        autoFocus
                      />
                      <button
                        type="button"
                        disabled={loading}
                        onClick={() => saveLabel(moment.url, editingLabel.value)}
                        className="inline-flex h-8 w-8 shrink-0 items-center justify-center bg-ink text-white transition hover:bg-teal disabled:opacity-60"
                      >
                        <Check className="h-3.5 w-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditingLabel(null)}
                        className="inline-flex h-8 w-8 shrink-0 items-center justify-center border border-ink/20 text-ink transition hover:bg-ink hover:text-white"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      className="group flex w-full min-w-0 items-center gap-1.5 text-left"
                      onClick={() => setEditingLabel({ url: moment.url, value: moment.label })}
                      title="Click to edit label"
                    >
                      <p className="truncate font-condensed text-sm uppercase tracking-editorial text-ink group-hover:text-teal">
                        {moment.label}
                      </p>
                      <Pencil className="h-3 w-3 shrink-0 text-ink/30 group-hover:text-teal" />
                    </button>
                  )}
                </div>
                <div className="mt-auto grid grid-cols-2 gap-2 pt-3">
                  <button
                    type="button"
                    disabled={loading}
                    onClick={() => setEditingLabel({ url: moment.url, value: moment.label })}
                    className="inline-flex h-10 min-w-0 items-center justify-center gap-1.5 border border-ink/20 px-2 font-condensed text-xs uppercase tracking-editorial text-ink transition hover:bg-ink hover:text-white disabled:opacity-60"
                  >
                    <Pencil className="h-3.5 w-3.5 shrink-0" />
                    <span className="truncate">Edit</span>
                  </button>
                  <button
                    type="button"
                    disabled={loading}
                    onClick={() => deleteMoment(moment)}
                    className="inline-flex h-10 min-w-0 items-center justify-center gap-1.5 bg-ink px-2 font-condensed text-xs uppercase tracking-editorial text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <Trash2 className="h-3.5 w-3.5 shrink-0" />
                    <span className="truncate">Delete</span>
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>

        {!moments.length && (
          <div className="mt-5 border border-dashed border-ink/20 p-6 text-center text-sm leading-6 text-ink/55">
            No uploaded moments yet.
          </div>
        )}
      </div>
    </div>
  );
}

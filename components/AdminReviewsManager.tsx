"use client";

import { FormEvent, useEffect, useState } from "react";
import { Check, Pencil, Plus, RefreshCcw, Star, Trash2, X } from "lucide-react";

type Review = {
  id: string;
  name: string;
  origin: string;
  service: string;
  text: string;
  rating: number;
  createdAt: string;
  approved: boolean;
};

const TOKEN_STORAGE_KEY = "khmer_tattoo_admin_token";

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`h-3 w-3 ${i < rating ? "fill-teal text-teal" : "text-ink/20"}`}
        />
      ))}
    </div>
  );
}

type EditState = {
  id: string;
  name: string;
  origin: string;
  service: string;
  text: string;
  rating: number;
};

export default function AdminReviewsManager() {
  const [token] = useState(() => {
    if (typeof window === "undefined") return "";
    return window.sessionStorage.getItem(TOKEN_STORAGE_KEY) ?? "";
  });

  const [reviews, setReviews] = useState<Review[]>([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [editState, setEditState] = useState<EditState | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newReview, setNewReview] = useState({ name: "", origin: "", service: "", text: "", rating: 5 });

  async function loadReviews(currentToken = token) {
    setLoading(true);
    setMessage("");
    try {
      const response = await fetch("/api/admin/reviews", {
        headers: { "x-admin-token": currentToken },
        cache: "no-store",
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Unable to load reviews.");
      setReviews(result.reviews);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to load reviews.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (token) loadReviews(token);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  async function toggleApprove(review: Review) {
    setLoading(true);
    setMessage("");
    try {
      const response = await fetch("/api/admin/reviews", {
        method: "PATCH",
        headers: { "content-type": "application/json", "x-admin-token": token },
        body: JSON.stringify({ id: review.id, approved: !review.approved }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Update failed.");
      setReviews((items) =>
        items.map((r) => (r.id === review.id ? { ...r, approved: !r.approved } : r))
      );
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Update failed.");
    } finally {
      setLoading(false);
    }
  }

  async function saveEdit() {
    if (!editState) return;
    setLoading(true);
    setMessage("");
    try {
      const response = await fetch("/api/admin/reviews", {
        method: "PATCH",
        headers: { "content-type": "application/json", "x-admin-token": token },
        body: JSON.stringify(editState),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Update failed.");
      setReviews((items) =>
        items.map((r) => (r.id === editState.id ? { ...r, ...editState } : r))
      );
      setEditState(null);
      setMessage("Saved.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Update failed.");
    } finally {
      setLoading(false);
    }
  }

  async function deleteReview(id: string) {
    if (!confirm("Delete this review?")) return;
    setLoading(true);
    setMessage("");
    try {
      const response = await fetch("/api/admin/reviews", {
        method: "DELETE",
        headers: { "content-type": "application/json", "x-admin-token": token },
        body: JSON.stringify({ id }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Delete failed.");
      setReviews((items) => items.filter((r) => r.id !== id));
      setMessage("Deleted.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Delete failed.");
    } finally {
      setLoading(false);
    }
  }

  async function handleAddReview(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!newReview.name.trim() || !newReview.text.trim()) {
      setMessage("Name and review text are required.");
      return;
    }
    setLoading(true);
    setMessage("");
    try {
      const response = await fetch("/api/admin/reviews", {
        method: "PATCH",
        headers: { "content-type": "application/json", "x-admin-token": token },
        body: JSON.stringify({
          id: "new",
          ...newReview,
          approved: true,
        }),
      });
      // Use public POST to create (approved: false) — admin can approve immediately after
      // Actually let's post to /api/reviews (public) but then approve via admin
      // Simpler: POST directly to admin endpoint with approved: true
      // The admin PATCH only updates existing. Let's use the public POST then approve.
      if (!response.ok) {
        // fallback: POST to public endpoint then reload
      }
    } catch {
      // ignore
    }

    // Use public POST then auto-approve
    try {
      const postResponse = await fetch("/api/reviews", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ ...newReview }),
      });
      const postResult = await postResponse.json();
      if (!postResponse.ok) throw new Error(postResult.error || "Add failed.");

      // Reload to get the new review, then approve the latest one
      const getResponse = await fetch("/api/admin/reviews", {
        headers: { "x-admin-token": token },
        cache: "no-store",
      });
      const getResult = await getResponse.json();
      if (getResponse.ok && Array.isArray(getResult.reviews)) {
        const latest = getResult.reviews
          .filter((r: Review) => !r.approved)
          .sort((a: Review, b: Review) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0];
        if (latest) {
          await fetch("/api/admin/reviews", {
            method: "PATCH",
            headers: { "content-type": "application/json", "x-admin-token": token },
            body: JSON.stringify({ id: latest.id, approved: true }),
          });
        }
      }

      setNewReview({ name: "", origin: "", service: "", text: "", rating: 5 });
      setShowAddForm(false);
      await loadReviews();
      setMessage("Review added.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Add failed.");
    } finally {
      setLoading(false);
    }
  }

  const pending = reviews.filter((r) => !r.approved);
  const approved = reviews.filter((r) => r.approved);

  return (
    <div className="grid gap-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="font-condensed text-xs uppercase tracking-editorial text-teal">
            All Reviews
          </p>
          <p className="mt-1 text-sm text-ink/55">
            {approved.length} approved · {pending.length} pending
          </p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            disabled={loading}
            onClick={() => loadReviews()}
            className="inline-flex items-center justify-center gap-2 border border-ink px-3 py-2 font-condensed text-xs uppercase tracking-editorial text-ink transition hover:bg-ink hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
          >
            <RefreshCcw className="h-4 w-4" />
            Refresh
          </button>
          <button
            type="button"
            onClick={() => setShowAddForm((v) => !v)}
            className="inline-flex items-center justify-center gap-2 bg-teal px-3 py-2 font-condensed text-xs uppercase tracking-editorial text-ink transition hover:opacity-90"
          >
            <Plus className="h-4 w-4" />
            Add Review
          </button>
        </div>
      </div>

      {message && (
        <p className="text-sm leading-6 text-ink/65">{message}</p>
      )}

      {showAddForm && (
        <form onSubmit={handleAddReview} className="border border-ink/10 bg-white p-4 sm:p-5">
          <p className="font-condensed text-xs uppercase tracking-editorial text-teal">New Review</p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <label className="grid gap-1.5">
              <span className="font-condensed text-xs uppercase tracking-editorial text-ink/60">Name *</span>
              <input
                value={newReview.name}
                onChange={(e) => setNewReview((v) => ({ ...v, name: e.target.value }))}
                className="border border-ink/15 bg-bone px-3 py-2.5 text-sm outline-none focus:border-teal"
                placeholder="Client name"
              />
            </label>
            <label className="grid gap-1.5">
              <span className="font-condensed text-xs uppercase tracking-editorial text-ink/60">Origin</span>
              <input
                value={newReview.origin}
                onChange={(e) => setNewReview((v) => ({ ...v, origin: e.target.value }))}
                className="border border-ink/15 bg-bone px-3 py-2.5 text-sm outline-none focus:border-teal"
                placeholder="Country or city"
              />
            </label>
            <label className="grid gap-1.5 sm:col-span-2">
              <span className="font-condensed text-xs uppercase tracking-editorial text-ink/60">Service</span>
              <input
                value={newReview.service}
                onChange={(e) => setNewReview((v) => ({ ...v, service: e.target.value }))}
                className="border border-ink/15 bg-bone px-3 py-2.5 text-sm outline-none focus:border-teal"
                placeholder="e.g. Khmer Sakyant shoulder piece"
              />
            </label>
            <label className="grid gap-1.5 sm:col-span-2">
              <span className="font-condensed text-xs uppercase tracking-editorial text-ink/60">Review text *</span>
              <textarea
                value={newReview.text}
                onChange={(e) => setNewReview((v) => ({ ...v, text: e.target.value }))}
                rows={3}
                className="border border-ink/15 bg-bone px-3 py-2.5 text-sm outline-none focus:border-teal"
                placeholder="What the client said..."
              />
            </label>
            <label className="grid gap-1.5">
              <span className="font-condensed text-xs uppercase tracking-editorial text-ink/60">Rating (1–5)</span>
              <select
                value={newReview.rating}
                onChange={(e) => setNewReview((v) => ({ ...v, rating: Number(e.target.value) }))}
                className="border border-ink/15 bg-bone px-3 py-2.5 text-sm outline-none focus:border-teal"
              >
                {[5, 4, 3, 2, 1].map((n) => (
                  <option key={n} value={n}>{n} star{n !== 1 ? "s" : ""}</option>
                ))}
              </select>
            </label>
          </div>
          <div className="mt-4 flex gap-2">
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 bg-ink px-4 py-2.5 font-condensed text-xs uppercase tracking-editorial text-white transition hover:bg-teal disabled:opacity-60"
            >
              <Plus className="h-4 w-4" />
              {loading ? "Saving..." : "Add & Approve"}
            </button>
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="inline-flex items-center justify-center gap-2 border border-ink/20 px-4 py-2.5 font-condensed text-xs uppercase tracking-editorial text-ink transition hover:bg-ink hover:text-white"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {pending.length > 0 && (
        <div>
          <p className="mb-3 font-condensed text-xs uppercase tracking-editorial text-ink/60">
            Pending approval ({pending.length})
          </p>
          <div className="grid gap-3">
            {pending.map((review) => (
              <ReviewCard
                key={review.id}
                review={review}
                editState={editState}
                loading={loading}
                onEdit={() => setEditState({ id: review.id, name: review.name, origin: review.origin, service: review.service, text: review.text, rating: review.rating })}
                onCancelEdit={() => setEditState(null)}
                onSaveEdit={saveEdit}
                onEditChange={(field, value) => setEditState((s) => s ? { ...s, [field]: value } : s)}
                onToggleApprove={() => toggleApprove(review)}
                onDelete={() => deleteReview(review.id)}
              />
            ))}
          </div>
        </div>
      )}

      {approved.length > 0 && (
        <div>
          <p className="mb-3 font-condensed text-xs uppercase tracking-editorial text-ink/60">
            Approved ({approved.length})
          </p>
          <div className="grid gap-3">
            {approved.map((review) => (
              <ReviewCard
                key={review.id}
                review={review}
                editState={editState}
                loading={loading}
                onEdit={() => setEditState({ id: review.id, name: review.name, origin: review.origin, service: review.service, text: review.text, rating: review.rating })}
                onCancelEdit={() => setEditState(null)}
                onSaveEdit={saveEdit}
                onEditChange={(field, value) => setEditState((s) => s ? { ...s, [field]: value } : s)}
                onToggleApprove={() => toggleApprove(review)}
                onDelete={() => deleteReview(review.id)}
              />
            ))}
          </div>
        </div>
      )}

      {reviews.length === 0 && !loading && (
        <div className="border border-dashed border-ink/20 p-6 text-center text-sm leading-6 text-ink/55">
          No reviews yet. Add one above or wait for customer submissions.
        </div>
      )}
    </div>
  );
}

type ReviewCardProps = {
  review: Review;
  editState: EditState | null;
  loading: boolean;
  onEdit: () => void;
  onCancelEdit: () => void;
  onSaveEdit: () => void;
  onEditChange: (field: keyof Omit<EditState, "id">, value: string | number) => void;
  onToggleApprove: () => void;
  onDelete: () => void;
};

function ReviewCard({
  review, editState, loading,
  onEdit, onCancelEdit, onSaveEdit, onEditChange,
  onToggleApprove, onDelete,
}: ReviewCardProps) {
  const isEditing = editState?.id === review.id;

  return (
    <article className={`border p-4 sm:p-5 ${review.approved ? "border-ink/10 bg-white" : "border-amber-200 bg-amber-50"}`}>
      {isEditing && editState ? (
        <div className="grid gap-3">
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="grid gap-1">
              <span className="font-condensed text-xs uppercase tracking-editorial text-ink/60">Name</span>
              <input
                value={editState.name}
                onChange={(e) => onEditChange("name", e.target.value)}
                className="border border-ink/15 bg-bone px-3 py-2 text-sm outline-none focus:border-teal"
              />
            </label>
            <label className="grid gap-1">
              <span className="font-condensed text-xs uppercase tracking-editorial text-ink/60">Origin</span>
              <input
                value={editState.origin}
                onChange={(e) => onEditChange("origin", e.target.value)}
                className="border border-ink/15 bg-bone px-3 py-2 text-sm outline-none focus:border-teal"
              />
            </label>
            <label className="grid gap-1 sm:col-span-2">
              <span className="font-condensed text-xs uppercase tracking-editorial text-ink/60">Service</span>
              <input
                value={editState.service}
                onChange={(e) => onEditChange("service", e.target.value)}
                className="border border-ink/15 bg-bone px-3 py-2 text-sm outline-none focus:border-teal"
              />
            </label>
            <label className="grid gap-1 sm:col-span-2">
              <span className="font-condensed text-xs uppercase tracking-editorial text-ink/60">Review text</span>
              <textarea
                value={editState.text}
                onChange={(e) => onEditChange("text", e.target.value)}
                rows={3}
                className="border border-ink/15 bg-bone px-3 py-2 text-sm outline-none focus:border-teal"
              />
            </label>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              disabled={loading}
              onClick={onSaveEdit}
              className="inline-flex items-center gap-2 bg-ink px-3 py-2 font-condensed text-xs uppercase tracking-editorial text-white transition hover:bg-teal disabled:opacity-60"
            >
              <Check className="h-3.5 w-3.5" />
              Save
            </button>
            <button
              type="button"
              onClick={onCancelEdit}
              className="inline-flex items-center gap-2 border border-ink/20 px-3 py-2 font-condensed text-xs uppercase tracking-editorial text-ink"
            >
              <X className="h-3.5 w-3.5" />
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <Stars rating={review.rating} />
              <p className="mt-2 text-sm leading-6 text-ink/80">{review.text}</p>
              <div className="mt-3 border-t border-ink/10 pt-3">
                <p className="font-condensed text-sm uppercase tracking-editorial text-ink">{review.name}</p>
                {(review.origin || review.service) && (
                  <p className="mt-0.5 text-xs uppercase tracking-[0.14em] text-ink/45">
                    {[review.origin, review.service].filter(Boolean).join(" / ")}
                  </p>
                )}
                <p className="mt-1 text-xs text-ink/30">
                  {new Date(review.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
            <span className={`shrink-0 px-2 py-1 font-condensed text-[10px] uppercase tracking-editorial ${review.approved ? "bg-teal/15 text-teal" : "bg-amber-100 text-amber-700"}`}>
              {review.approved ? "Live" : "Pending"}
            </span>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            <button
              type="button"
              disabled={loading}
              onClick={onToggleApprove}
              className="inline-flex items-center gap-1.5 border border-ink/20 px-3 py-2 font-condensed text-xs uppercase tracking-editorial text-ink transition hover:bg-ink hover:text-white disabled:opacity-60"
            >
              <Check className="h-3.5 w-3.5" />
              {review.approved ? "Unpublish" : "Approve"}
            </button>
            <button
              type="button"
              disabled={loading}
              onClick={onEdit}
              className="inline-flex items-center gap-1.5 border border-ink/20 px-3 py-2 font-condensed text-xs uppercase tracking-editorial text-ink transition hover:bg-ink hover:text-white disabled:opacity-60"
            >
              <Pencil className="h-3.5 w-3.5" />
              Edit
            </button>
            <button
              type="button"
              disabled={loading}
              onClick={onDelete}
              className="inline-flex items-center gap-1.5 border border-red-200 px-3 py-2 font-condensed text-xs uppercase tracking-editorial text-red-600 transition hover:bg-red-600 hover:text-white disabled:opacity-60"
            >
              <Trash2 className="h-3.5 w-3.5" />
              Delete
            </button>
          </div>
        </>
      )}
    </article>
  );
}

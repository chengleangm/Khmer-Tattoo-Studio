"use client";

import { useState } from "react";
import AdminReviewMomentsManager from "@/components/AdminReviewMomentsManager";
import AdminReviewsManager from "@/components/AdminReviewsManager";

type Tab = "moments" | "reviews";

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState<Tab>("moments");

  return (
    <main className="min-h-screen bg-bone">
      <section className="grain bg-ink px-4 py-12 text-white sm:px-5 sm:py-16 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <p className="font-condensed text-xs uppercase tracking-editorial text-teal sm:text-sm">
            Admin Dashboard
          </p>
          <h1 className="mt-3 max-w-3xl font-display text-[clamp(3rem,13vw,7rem)] leading-[0.78]">
            Manage Studio
          </h1>
        </div>
      </section>

      <div className="border-b border-ink/10 bg-white px-4 sm:px-5 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <nav className="flex gap-0">
            <button
              type="button"
              onClick={() => setActiveTab("moments")}
              className={`border-b-2 px-5 py-4 font-condensed text-xs uppercase tracking-editorial transition ${
                activeTab === "moments"
                  ? "border-teal text-ink"
                  : "border-transparent text-ink/40 hover:text-ink"
              }`}
            >
              Customer Moments
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("reviews")}
              className={`border-b-2 px-5 py-4 font-condensed text-xs uppercase tracking-editorial transition ${
                activeTab === "reviews"
                  ? "border-teal text-ink"
                  : "border-transparent text-ink/40 hover:text-ink"
              }`}
            >
              Reviews
            </button>
          </nav>
        </div>
      </div>

      <section className="px-4 py-8 sm:px-5 sm:py-10 lg:px-8">
        {activeTab === "moments" && <AdminReviewMomentsManager />}
        {activeTab === "reviews" && (
          <div className="mx-auto max-w-4xl">
            <AdminReviewsManager />
          </div>
        )}
      </section>
    </main>
  );
}

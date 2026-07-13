"use client";

import { useState } from "react";
import AdminReviewMomentsManager from "@/components/AdminReviewMomentsManager";
import AdminReviewsManager from "@/components/AdminReviewsManager";
import AdminStoreManager from "@/components/AdminStoreManager";
import AdminOrdersManager from "@/components/AdminOrdersManager";
import AdminPromotionsManager from "@/components/AdminPromotionsManager";

type Tab = "moments" | "reviews" | "promotions" | "store" | "orders";

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState<Tab>("moments");

  const tabs: { id: Tab; label: string }[] = [
    { id: "moments", label: "Customer Moments" },
    { id: "reviews", label: "Reviews" },
    { id: "promotions", label: "Promotions" },
    { id: "store", label: "Store Products" },
    { id: "orders", label: "Orders" },
  ];

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
          <nav className="flex gap-0 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`shrink-0 border-b-2 px-5 py-4 font-condensed text-xs uppercase tracking-editorial transition ${
                  activeTab === tab.id
                    ? "border-teal text-ink"
                    : "border-transparent text-ink/40 hover:text-ink"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      <section className="px-4 py-8 sm:px-5 sm:py-10 lg:px-8">
        {activeTab === "moments" && <AdminReviewMomentsManager />}
        {activeTab === "reviews" && (
          <div className="mx-auto max-w-7xl">
            <AdminReviewsManager />
          </div>
        )}
        {activeTab === "store" && <AdminStoreManager />}
        {activeTab === "promotions" && <AdminPromotionsManager />}
        {activeTab === "orders" && <AdminOrdersManager />}
      </section>
    </main>
  );
}

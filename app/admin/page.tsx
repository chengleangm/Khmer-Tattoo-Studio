import AdminReviewMomentsManager from "@/components/AdminReviewMomentsManager";

export default function AdminDashboardPage() {
  return (
    <main className="min-h-screen bg-bone">
      <section className="grain bg-ink px-4 py-12 text-white sm:px-5 sm:py-16 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <p className="font-condensed text-xs uppercase tracking-editorial text-teal sm:text-sm">
            Admin Dashboard
          </p>
          <h1 className="mt-3 max-w-3xl font-display text-[clamp(3rem,13vw,7rem)] leading-[0.78]">
            Manage Reviews
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-6 text-white/65 sm:text-base sm:leading-7">
            Log in with your admin password, upload customer moment images, and manage what appears first on the Reviews page.
          </p>
        </div>
      </section>

      <section className="px-4 py-8 sm:px-5 sm:py-10 lg:px-8">
        <AdminReviewMomentsManager />
      </section>
    </main>
  );
}

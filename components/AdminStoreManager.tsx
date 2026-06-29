"use client";

import Image from "next/image";
import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Check, Eye, EyeOff, FolderPlus, ImagePlus, LogOut,
  Pencil, Plus, RefreshCcw, Tag, Trash2, UploadCloud, X,
} from "lucide-react";

type StoreProduct = {
  id: string;
  name: string;
  category: string;
  desc: string;
  price: string;
  tag: string;
  imageUrl: string;
  inStock: boolean;
  visible: boolean;
  createdAt: string;
};

const TOKEN_KEY = "khmer_tattoo_admin_token";

const DEFAULT_CATEGORIES = [
  "T-Shirt", "Hoodie", "Accessory", "Art Print", "Aftercare", "Gift Voucher", "Collectible",
];

const BLANK_PRODUCT = {
  name: "", category: "", desc: "", price: "", tag: "",
  inStock: true, visible: true,
};

type EditProduct = Omit<StoreProduct, "createdAt">;

export default function AdminStoreManager() {
  const router = useRouter();
  const [token] = useState(() => {
    if (typeof window === "undefined") return "";
    return window.sessionStorage.getItem(TOKEN_KEY) ?? "";
  });

  const [products, setProducts] = useState<StoreProduct[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [tab, setTab] = useState<"products" | "categories">("products");

  // New product form
  const [form, setForm] = useState({ ...BLANK_PRODUCT });
  const [imageFile, setImageFile] = useState<File | null>(null);

  // Edit
  const [editing, setEditing] = useState<EditProduct | null>(null);

  // Categories
  const [newCatName, setNewCatName] = useState("");
  const [renamingCat, setRenamingCat] = useState<{ old: string; value: string } | null>(null);

  function logout() {
    window.sessionStorage.removeItem(TOKEN_KEY);
    router.push("/admin");
  }

  async function load(currentToken = token) {
    setLoading(true);
    setMessage("");
    try {
      const res = await fetch("/api/admin/products", {
        headers: { "x-admin-token": currentToken },
        cache: "no-store",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Load failed.");
      setProducts(data.products ?? []);
      // Seed default categories if none exist yet
      const cats: string[] = data.categories ?? [];
      if (cats.length === 0) {
        setCategories(DEFAULT_CATEGORIES);
      } else {
        setCategories(cats);
      }
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Load failed.");
      if (error instanceof Error && error.message === "Unauthorized.") logout();
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (token) load(token);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  // ── Product CRUD ──────────────────────────────────────────────────────────

  async function handleCreateProduct(e: FormEvent) {
    e.preventDefault();
    if (!form.name.trim()) { setMessage("Product name is required."); return; }
    if (!form.price.trim()) { setMessage("Price is required."); return; }

    setLoading(true);
    setMessage("");
    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => fd.set(k, String(v)));
    if (imageFile) fd.set("image", imageFile);

    try {
      const res = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "x-admin-token": token },
        body: fd,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Create failed.");
      setProducts((prev) => [...prev, data.product]);
      setForm({ ...BLANK_PRODUCT });
      setImageFile(null);
      setMessage("Product created.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Create failed.");
    } finally {
      setLoading(false);
    }
  }

  async function saveEdit() {
    if (!editing) return;
    setLoading(true);
    setMessage("");
    try {
      const res = await fetch("/api/admin/products", {
        method: "PATCH",
        headers: { "content-type": "application/json", "x-admin-token": token },
        body: JSON.stringify(editing),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Update failed.");
      setProducts((prev) => prev.map((p) => (p.id === editing.id ? { ...p, ...editing } : p)));
      setEditing(null);
      setMessage("Saved.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Update failed.");
    } finally {
      setLoading(false);
    }
  }

  async function toggleVisible(product: StoreProduct) {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/products", {
        method: "PATCH",
        headers: { "content-type": "application/json", "x-admin-token": token },
        body: JSON.stringify({ id: product.id, visible: !product.visible }),
      });
      if (res.ok) {
        setProducts((prev) => prev.map((p) => p.id === product.id ? { ...p, visible: !p.visible } : p));
      }
    } finally {
      setLoading(false);
    }
  }

  async function toggleStock(product: StoreProduct) {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/products", {
        method: "PATCH",
        headers: { "content-type": "application/json", "x-admin-token": token },
        body: JSON.stringify({ id: product.id, inStock: !product.inStock }),
      });
      if (res.ok) {
        setProducts((prev) => prev.map((p) => p.id === product.id ? { ...p, inStock: !p.inStock } : p));
      }
    } finally {
      setLoading(false);
    }
  }

  async function deleteProduct(id: string) {
    if (!confirm("Delete this product?")) return;
    setLoading(true);
    setMessage("");
    try {
      const res = await fetch("/api/admin/products", {
        method: "DELETE",
        headers: { "content-type": "application/json", "x-admin-token": token },
        body: JSON.stringify({ id }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Delete failed.");
      setProducts((prev) => prev.filter((p) => p.id !== id));
      setMessage("Deleted.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Delete failed.");
    } finally {
      setLoading(false);
    }
  }

  // ── Category CRUD ─────────────────────────────────────────────────────────

  async function addCategory(e: FormEvent) {
    e.preventDefault();
    const name = newCatName.trim();
    if (!name) return;
    if (categories.includes(name)) { setMessage("Category already exists."); return; }

    setLoading(true);
    setMessage("");
    try {
      const res = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "content-type": "application/json", "x-admin-token": token },
        body: JSON.stringify({ action: "add-category", name }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Add failed.");
      setCategories(data.categories ?? [...categories, name]);
      setNewCatName("");
      setMessage("Category added.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Add failed.");
    } finally {
      setLoading(false);
    }
  }

  async function deleteCategory(name: string) {
    if (!confirm(`Delete category "${name}"? Products in this category won't be deleted.`)) return;
    setLoading(true);
    setMessage("");
    try {
      const res = await fetch("/api/admin/products", {
        method: "PATCH",
        headers: { "content-type": "application/json", "x-admin-token": token },
        body: JSON.stringify({ action: "delete-category", name }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Delete failed.");
      setCategories(data.categories ?? categories.filter((c) => c !== name));
      setMessage("Category deleted.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Delete failed.");
    } finally {
      setLoading(false);
    }
  }

  async function saveRenameCategory() {
    if (!renamingCat) return;
    const name = renamingCat.value.trim();
    if (!name) return;
    setLoading(true);
    setMessage("");
    try {
      const res = await fetch("/api/admin/products", {
        method: "PATCH",
        headers: { "content-type": "application/json", "x-admin-token": token },
        body: JSON.stringify({ action: "rename-category", oldName: renamingCat.old, name }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Rename failed.");
      setCategories(data.categories ?? categories.map((c) => c === renamingCat.old ? name : c));
      setRenamingCat(null);
      setMessage("Category renamed.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Rename failed.");
    } finally {
      setLoading(false);
    }
  }

  // ─────────────────────────────────────────────────────────────────────────

  if (!token) {
    return (
      <div className="mx-auto max-w-xl border border-ink/10 bg-white p-5">
        <p className="font-condensed text-xs uppercase tracking-editorial text-teal">Admin</p>
        <h2 className="mt-2 font-display text-[clamp(2.5rem,12vw,4.5rem)] leading-[0.78]">Login Required</h2>
        <a href="/admin" className="mt-5 inline-flex items-center justify-center bg-ink px-4 py-3 font-condensed text-xs uppercase tracking-editorial text-white transition hover:bg-teal">
          Go To Login
        </a>
      </div>
    );
  }

  const visibleCount = products.filter((p) => p.visible).length;

  return (
    <div className="mx-auto max-w-7xl">
      {/* Sub-tabs */}
      <div className="mb-5 flex items-center justify-between gap-4 border-b border-ink/10">
        <div className="flex">
          {(["products", "categories"] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTab(t)}
              className={`border-b-2 px-4 py-3 font-condensed text-xs uppercase tracking-editorial transition ${
                tab === t ? "border-teal text-ink" : "border-transparent text-ink/40 hover:text-ink"
              }`}
            >
              {t === "products" ? `Products (${products.length})` : `Categories (${categories.length})`}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-3 pb-1">
          <span className="font-condensed text-xs text-ink/45">{visibleCount} live in store</span>
          <button
            type="button"
            onClick={logout}
            className="inline-flex h-9 w-9 items-center justify-center border border-ink/20 text-ink transition hover:bg-ink hover:text-white"
            aria-label="Log out"
          >
            <LogOut className="h-4 w-4" />
          </button>
          <button
            type="button"
            disabled={loading}
            onClick={() => load()}
            className="inline-flex h-9 items-center gap-1.5 border border-ink/20 px-3 font-condensed text-xs uppercase tracking-editorial text-ink transition hover:bg-ink hover:text-white disabled:opacity-60"
          >
            <RefreshCcw className="h-3.5 w-3.5" />
            Refresh
          </button>
        </div>
      </div>

      {message && (
        <p className="mb-4 border-l-2 border-teal pl-3 text-sm text-ink/70">{message}</p>
      )}

      {/* ── PRODUCTS TAB ── */}
      {tab === "products" && (
        <div className="grid gap-5 lg:grid-cols-[340px_1fr]">
          {/* Create form */}
          <aside>
            <form onSubmit={handleCreateProduct} className="border border-ink/10 bg-white p-4 sm:p-5">
              <p className="font-condensed text-xs uppercase tracking-editorial text-teal">Add New Product</p>

              <div className="mt-4 grid gap-3">
                <label className="grid gap-1.5">
                  <span className="label-xs">Product Name *</span>
                  <input
                    value={form.name}
                    onChange={(e) => setForm((v) => ({ ...v, name: e.target.value }))}
                    className="field"
                    placeholder="e.g. Khmer T-Shirt Black"
                  />
                </label>

                <label className="grid gap-1.5">
                  <span className="label-xs">Category</span>
                  <select
                    value={form.category}
                    onChange={(e) => setForm((v) => ({ ...v, category: e.target.value }))}
                    className="field"
                  >
                    <option value="">— Select category —</option>
                    {categories.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </label>

                <label className="grid gap-1.5">
                  <span className="label-xs">Price *</span>
                  <input
                    value={form.price}
                    onChange={(e) => setForm((v) => ({ ...v, price: e.target.value }))}
                    className="field"
                    placeholder="e.g. $18 or From $20"
                  />
                </label>

                <label className="grid gap-1.5">
                  <span className="label-xs">Badge tag</span>
                  <input
                    value={form.tag}
                    onChange={(e) => setForm((v) => ({ ...v, tag: e.target.value }))}
                    className="field"
                    placeholder="e.g. New, Best Seller, Sale"
                  />
                </label>

                <label className="grid gap-1.5">
                  <span className="label-xs">Description</span>
                  <textarea
                    value={form.desc}
                    onChange={(e) => setForm((v) => ({ ...v, desc: e.target.value }))}
                    rows={3}
                    className="field resize-none"
                    placeholder="Short product description..."
                  />
                </label>

                <label className="mt-1 flex cursor-pointer items-center justify-center gap-2 border border-dashed border-ink/25 bg-bone py-4 text-sm text-ink/55 transition hover:border-teal">
                  <ImagePlus className="h-4 w-4 text-teal" />
                  {imageFile ? imageFile.name : "Upload product image (optional)"}
                  <input type="file" accept="image/*" className="sr-only" onChange={(e) => setImageFile(e.target.files?.[0] ?? null)} />
                </label>

                <div className="flex gap-4">
                  <label className="flex cursor-pointer items-center gap-2">
                    <input type="checkbox" checked={form.inStock} onChange={(e) => setForm((v) => ({ ...v, inStock: e.target.checked }))} className="h-4 w-4 accent-teal" />
                    <span className="label-xs">In Stock</span>
                  </label>
                  <label className="flex cursor-pointer items-center gap-2">
                    <input type="checkbox" checked={form.visible} onChange={(e) => setForm((v) => ({ ...v, visible: e.target.checked }))} className="h-4 w-4 accent-teal" />
                    <span className="label-xs">Visible in store</span>
                  </label>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="mt-4 inline-flex w-full items-center justify-center gap-2 bg-ink px-4 py-3 font-condensed text-xs uppercase tracking-editorial text-white transition hover:bg-teal disabled:opacity-60"
              >
                <UploadCloud className="h-4 w-4" />
                {loading ? "Saving..." : "Create Product"}
              </button>
            </form>
          </aside>

          {/* Product list */}
          <div className="grid gap-3 content-start">
            {products.length === 0 && !loading && (
              <div className="border border-dashed border-ink/20 p-8 text-center">
                <p className="font-condensed text-xs uppercase tracking-editorial text-ink/40">No products yet</p>
                <p className="mt-2 text-sm text-ink/50">Add your first product using the form on the left.</p>
                <p className="mt-4 text-xs text-ink/35">The store page will show a Coming Soon banner until you add and publish a product.</p>
              </div>
            )}

            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                categories={categories}
                editing={editing?.id === product.id ? editing : null}
                loading={loading}
                onEdit={() => setEditing({ id: product.id, name: product.name, category: product.category, desc: product.desc, price: product.price, tag: product.tag, imageUrl: product.imageUrl, inStock: product.inStock, visible: product.visible })}
                onCancelEdit={() => setEditing(null)}
                onSaveEdit={saveEdit}
                onEditChange={(field, value) => setEditing((s) => s ? { ...s, [field]: value } : s)}
                onToggleVisible={() => toggleVisible(product)}
                onToggleStock={() => toggleStock(product)}
                onDelete={() => deleteProduct(product.id)}
              />
            ))}
          </div>
        </div>
      )}

      {/* ── CATEGORIES TAB ── */}
      {tab === "categories" && (
        <div className="grid gap-5 lg:grid-cols-[340px_1fr]">
          <aside>
            <form onSubmit={addCategory} className="border border-ink/10 bg-white p-4 sm:p-5">
              <p className="font-condensed text-xs uppercase tracking-editorial text-teal">Add Category</p>
              <p className="mt-1 text-xs text-ink/50">
                Categories group your products in the store. Examples: T-Shirt, Hoodie, Accessory, Art Print.
              </p>
              <label className="mt-4 grid gap-1.5">
                <span className="label-xs">Category Name</span>
                <input
                  value={newCatName}
                  onChange={(e) => setNewCatName(e.target.value)}
                  className="field"
                  placeholder="e.g. Cambodia Tee"
                />
              </label>
              <button
                type="submit"
                disabled={loading || !newCatName.trim()}
                className="mt-3 inline-flex w-full items-center justify-center gap-2 bg-ink px-4 py-3 font-condensed text-xs uppercase tracking-editorial text-white transition hover:bg-teal disabled:opacity-60"
              >
                <FolderPlus className="h-4 w-4" />
                Add Category
              </button>
            </form>

            <div className="mt-4 border border-ink/10 bg-white p-4 sm:p-5">
              <p className="font-condensed text-xs uppercase tracking-editorial text-teal">Product Ideas</p>
              <ul className="mt-3 grid gap-2 text-xs text-ink/60">
                <li className="flex items-start gap-1.5"><Tag className="mt-0.5 h-3 w-3 shrink-0 text-teal" />Khmer T-Shirt (Angkor, Sakyant, Cambodia flag prints)</li>
                <li className="flex items-start gap-1.5"><Tag className="mt-0.5 h-3 w-3 shrink-0 text-teal" />Studio Hoodie (logo + yant graphic)</li>
                <li className="flex items-start gap-1.5"><Tag className="mt-0.5 h-3 w-3 shrink-0 text-teal" />Sakyant Art Print (A4/A5 archival)</li>
                <li className="flex items-start gap-1.5"><Tag className="mt-0.5 h-3 w-3 shrink-0 text-teal" />Aftercare Kit</li>
                <li className="flex items-start gap-1.5"><Tag className="mt-0.5 h-3 w-3 shrink-0 text-teal" />Bamboo Stylus Collectible</li>
                <li className="flex items-start gap-1.5"><Tag className="mt-0.5 h-3 w-3 shrink-0 text-teal" />Gift Voucher ($20 / $50 / $100)</li>
                <li className="flex items-start gap-1.5"><Tag className="mt-0.5 h-3 w-3 shrink-0 text-teal" />Krama (traditional Khmer scarf)</li>
                <li className="flex items-start gap-1.5"><Tag className="mt-0.5 h-3 w-3 shrink-0 text-teal" />Enamel Pin (yant symbols)</li>
              </ul>
            </div>
          </aside>

          <div className="border border-ink/10 bg-white p-4 sm:p-5">
            <p className="font-condensed text-xs uppercase tracking-editorial text-teal">
              All Categories ({categories.length})
            </p>
            <div className="mt-4 grid gap-2">
              {categories.map((cat) => {
                const count = products.filter((p) => p.category === cat).length;
                return (
                  <div key={cat} className="flex items-center gap-2 border border-ink/10 bg-bone px-3 py-2.5">
                    {renamingCat?.old === cat ? (
                      <div className="flex flex-1 gap-1.5">
                        <input
                          value={renamingCat.value}
                          onChange={(e) => setRenamingCat((s) => s ? { ...s, value: e.target.value } : s)}
                          onKeyDown={(e) => { if (e.key === "Enter") saveRenameCategory(); if (e.key === "Escape") setRenamingCat(null); }}
                          className="min-w-0 flex-1 border border-ink/15 bg-white px-2 py-1 text-sm outline-none focus:border-teal"
                          autoFocus
                        />
                        <button type="button" disabled={loading} onClick={saveRenameCategory} className="inline-flex h-8 w-8 items-center justify-center bg-ink text-white hover:bg-teal disabled:opacity-60"><Check className="h-3.5 w-3.5" /></button>
                        <button type="button" onClick={() => setRenamingCat(null)} className="inline-flex h-8 w-8 items-center justify-center border border-ink/20 text-ink"><X className="h-3.5 w-3.5" /></button>
                      </div>
                    ) : (
                      <>
                        <span className="flex-1 font-condensed text-sm uppercase tracking-editorial">{cat}</span>
                        <span className="text-xs text-ink/40">{count} product{count !== 1 ? "s" : ""}</span>
                        <button type="button" onClick={() => setRenamingCat({ old: cat, value: cat })} className="inline-flex h-7 w-7 items-center justify-center border border-ink/15 text-ink/50 transition hover:border-teal hover:text-teal"><Pencil className="h-3 w-3" /></button>
                        <button type="button" disabled={loading} onClick={() => deleteCategory(cat)} className="inline-flex h-7 w-7 items-center justify-center border border-ink/15 text-ink/50 transition hover:border-red-400 hover:text-red-600 disabled:opacity-60"><Trash2 className="h-3 w-3" /></button>
                      </>
                    )}
                  </div>
                );
              })}
              {categories.length === 0 && (
                <p className="py-4 text-center text-sm text-ink/45">No categories yet. Add one to get started.</p>
              )}
            </div>
          </div>
        </div>
      )}

      <style jsx global>{`
        .label-xs { font-family: var(--font-condensed, sans-serif); font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.2em; color: rgb(5 7 6 / 0.55); }
        .field { width: 100%; border: 1px solid rgb(5 7 6 / 0.15); background: #f5f3ef; padding: 0.55rem 0.75rem; font-size: 0.875rem; outline: none; }
        .field:focus { border-color: #c8a24a; }
      `}</style>
    </div>
  );
}

// ── Product Card ──────────────────────────────────────────────────────────────

type CardProps = {
  product: StoreProduct;
  categories: string[];
  editing: EditProduct | null;
  loading: boolean;
  onEdit: () => void;
  onCancelEdit: () => void;
  onSaveEdit: () => void;
  onEditChange: (field: keyof Omit<EditProduct, "id">, value: string | boolean) => void;
  onToggleVisible: () => void;
  onToggleStock: () => void;
  onDelete: () => void;
};

function ProductCard({ product, categories, editing, loading, onEdit, onCancelEdit, onSaveEdit, onEditChange, onToggleVisible, onToggleStock, onDelete }: CardProps) {
  const isEditing = editing !== null;

  return (
    <article className={`border bg-white p-4 sm:p-5 ${product.visible ? "border-ink/10" : "border-ink/05 opacity-60"}`}>
      {isEditing && editing ? (
        <div className="grid gap-3">
          <p className="font-condensed text-xs uppercase tracking-editorial text-teal">Editing: {product.name}</p>
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="grid gap-1">
              <span className="label-xs">Name</span>
              <input value={editing.name} onChange={(e) => onEditChange("name", e.target.value)} className="field" />
            </label>
            <label className="grid gap-1">
              <span className="label-xs">Category</span>
              <select value={editing.category} onChange={(e) => onEditChange("category", e.target.value)} className="field">
                <option value="">— None —</option>
                {categories.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </label>
            <label className="grid gap-1">
              <span className="label-xs">Price</span>
              <input value={editing.price} onChange={(e) => onEditChange("price", e.target.value)} className="field" placeholder="$18" />
            </label>
            <label className="grid gap-1">
              <span className="label-xs">Badge tag</span>
              <input value={editing.tag} onChange={(e) => onEditChange("tag", e.target.value)} className="field" placeholder="New, Sale..." />
            </label>
            <label className="grid gap-1 sm:col-span-2">
              <span className="label-xs">Description</span>
              <textarea value={editing.desc} onChange={(e) => onEditChange("desc", e.target.value)} rows={2} className="field resize-none" />
            </label>
            <label className="grid gap-1 sm:col-span-2">
              <span className="label-xs">Image URL (leave blank to keep existing)</span>
              <input value={editing.imageUrl} onChange={(e) => onEditChange("imageUrl", e.target.value)} className="field" placeholder="https://..." />
            </label>
            <div className="flex gap-4 sm:col-span-2">
              <label className="flex cursor-pointer items-center gap-2">
                <input type="checkbox" checked={editing.inStock} onChange={(e) => onEditChange("inStock", e.target.checked)} className="h-4 w-4 accent-teal" />
                <span className="label-xs">In Stock</span>
              </label>
              <label className="flex cursor-pointer items-center gap-2">
                <input type="checkbox" checked={editing.visible} onChange={(e) => onEditChange("visible", e.target.checked)} className="h-4 w-4 accent-teal" />
                <span className="label-xs">Visible in store</span>
              </label>
            </div>
          </div>
          <div className="flex gap-2">
            <button type="button" disabled={loading} onClick={onSaveEdit} className="inline-flex items-center gap-1.5 bg-ink px-3 py-2 font-condensed text-xs uppercase tracking-editorial text-white transition hover:bg-teal disabled:opacity-60"><Check className="h-3.5 w-3.5" />Save</button>
            <button type="button" onClick={onCancelEdit} className="inline-flex items-center gap-1.5 border border-ink/20 px-3 py-2 font-condensed text-xs uppercase tracking-editorial text-ink"><X className="h-3.5 w-3.5" />Cancel</button>
          </div>
        </div>
      ) : (
        <div className="flex gap-4">
          {product.imageUrl && (
            <div className="relative h-20 w-20 shrink-0 overflow-hidden border border-ink/10 bg-bone">
              <Image src={product.imageUrl} alt={product.name} fill sizes="80px" className="object-cover" />
            </div>
          )}
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-start gap-2">
              <div className="flex-1 min-w-0">
                <p className="font-condensed text-[0.65rem] uppercase tracking-editorial text-ink/45">{product.category || "Uncategorized"}</p>
                <p className="mt-0.5 font-display text-xl leading-none">{product.name}</p>
              </div>
              <div className="flex shrink-0 flex-wrap gap-1">
                {product.tag && (
                  <span className="bg-teal px-2 py-0.5 font-condensed text-[0.6rem] uppercase tracking-editorial text-white">{product.tag}</span>
                )}
                <span className={`px-2 py-0.5 font-condensed text-[0.6rem] uppercase tracking-editorial ${product.inStock ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"}`}>
                  {product.inStock ? "In Stock" : "Out of Stock"}
                </span>
                <span className={`px-2 py-0.5 font-condensed text-[0.6rem] uppercase tracking-editorial ${product.visible ? "bg-teal/15 text-teal" : "bg-ink/10 text-ink/50"}`}>
                  {product.visible ? "Live" : "Hidden"}
                </span>
              </div>
            </div>
            <p className="mt-1.5 font-display text-lg leading-none text-teal">{product.price}</p>
            {product.desc && <p className="mt-1.5 line-clamp-2 text-xs leading-5 text-ink/55">{product.desc}</p>}
            <div className="mt-3 flex flex-wrap gap-2">
              <button type="button" disabled={loading} onClick={onToggleVisible} className="inline-flex items-center gap-1.5 border border-ink/20 px-2.5 py-1.5 font-condensed text-[0.65rem] uppercase tracking-editorial text-ink transition hover:bg-ink hover:text-white disabled:opacity-60">
                {product.visible ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                {product.visible ? "Hide" : "Publish"}
              </button>
              <button type="button" disabled={loading} onClick={onToggleStock} className="inline-flex items-center gap-1.5 border border-ink/20 px-2.5 py-1.5 font-condensed text-[0.65rem] uppercase tracking-editorial text-ink transition hover:bg-ink hover:text-white disabled:opacity-60">
                {product.inStock ? "Mark Out of Stock" : "Mark In Stock"}
              </button>
              <button type="button" disabled={loading} onClick={onEdit} className="inline-flex items-center gap-1.5 border border-ink/20 px-2.5 py-1.5 font-condensed text-[0.65rem] uppercase tracking-editorial text-ink transition hover:bg-ink hover:text-white disabled:opacity-60">
                <Pencil className="h-3.5 w-3.5" />Edit
              </button>
              <button type="button" disabled={loading} onClick={onDelete} className="inline-flex items-center gap-1.5 border border-red-200 px-2.5 py-1.5 font-condensed text-[0.65rem] uppercase tracking-editorial text-red-600 transition hover:bg-red-600 hover:text-white disabled:opacity-60">
                <Trash2 className="h-3.5 w-3.5" />Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </article>
  );
}

// Extra: quick add button for popular products
export function StoreProductQuickAdd({ onAdd }: { onAdd: (name: string, category: string, price: string) => void }) {
  const suggestions = [
    { name: "Khmer T-Shirt (Black)", category: "T-Shirt", price: "$18" },
    { name: "Khmer T-Shirt (White)", category: "T-Shirt", price: "$18" },
    { name: "Studio Hoodie", category: "Hoodie", price: "$38" },
    { name: "Sakyant Art Print A5", category: "Art Print", price: "$25" },
    { name: "Aftercare Kit", category: "Aftercare", price: "$12" },
    { name: "Gift Voucher $50", category: "Gift Voucher", price: "$50" },
  ];
  return (
    <div className="mt-4 border-t border-ink/10 pt-4">
      <p className="label-xs mb-2">Quick Add (click to fill form)</p>
      <div className="flex flex-wrap gap-1.5">
        {suggestions.map((s) => (
          <button
            key={s.name}
            type="button"
            onClick={() => onAdd(s.name, s.category, s.price)}
            className="border border-ink/15 bg-bone px-2 py-1 font-condensed text-[0.6rem] uppercase tracking-editorial text-ink/60 transition hover:border-teal hover:text-teal"
          >
            <Plus className="mr-0.5 inline h-2.5 w-2.5" />
            {s.name}
          </button>
        ))}
      </div>
    </div>
  );
}

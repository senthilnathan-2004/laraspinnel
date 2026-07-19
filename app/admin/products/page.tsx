"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import AdminTopbar from "@/components/admin/AdminTopbar";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import CustomSelect from "@/components/shared/CustomSelect";
import { Plus, Search, Pencil, Trash2, ShoppingBag } from "lucide-react";

interface Product {
  _id: string;
  name: string;
  slug: string;
  category: {
    _id: string;
    name: string;
  };
  price: number;
  discountPrice?: number;
  stock: number;
  isFeatured: boolean;
  isActive: boolean;
  images: string[];
  description?: string;
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<{ label: string; value: string }[]>([]);
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const fetchProductsAndCategories = async () => {
    setIsLoading(true);
    try {
      const [prodRes, catRes] = await Promise.all([
        fetch("/api/admin/products"),
        fetch("/api/admin/categories")
      ]);

      if (prodRes.ok && catRes.ok) {
        const prodData = await prodRes.json();
        const catData = await catRes.json();
        setProducts(prodData);
        setFilteredProducts(prodData);
        setCategories([
          { label: "All Categories", value: "all" },
          ...catData.map((c: any) => ({ label: c.name, value: c._id }))
        ]);
      } else {
        setError("Failed to fetch product metrics");
      }
    } catch (err) {
      setError("Failed to fetch product metrics");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProductsAndCategories();
  }, []);

  useEffect(() => {
    let results = products.filter(
      (p) =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (categoryFilter !== "all") {
      results = results.filter((p) => p.category?._id === categoryFilter);
    }

    setFilteredProducts(results);
  }, [searchTerm, categoryFilter, products]);

  const handleDeleteClick = (id: string) => {
    setConfirmDeleteId(id);
  };

  const doDelete = async () => {
    if (!confirmDeleteId) return;
    const id = confirmDeleteId;
    setConfirmDeleteId(null);
    try {
      const res = await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (res.ok) {
        setProducts(products.filter((p) => p._id !== id));
      } else {
        alert(data.error || "Failed to delete product");
      }
    } catch (err) {
      alert("Failed to delete product");
    }
  };

  return (
    <div className="flex-1 flex flex-col min-h-screen">
      <ConfirmDialog
        isOpen={!!confirmDeleteId}
        title="Delete Product"
        message="Are you sure you want to delete this product? This action cannot be undone."
        confirmLabel="Delete"
        onConfirm={doDelete}
        onCancel={() => setConfirmDeleteId(null)}
      />
      
      <AdminTopbar title="Gift Products" />

      <div className="flex-1 p-3 md:p-6 space-y-6 w-full animate-in fade-in">
        {/* Header Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:max-w-xl">
            {/* Search */}
            <div className="relative w-full">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-brand-gray">
                <Search size={16} />
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search products by name..."
                className="w-full h-10 pl-9 pr-4 bg-white border border-brand-border rounded-xl text-sm text-brand-black focus:ring-2 focus:ring-goat-primary outline-none transition-all"
              />
            </div>

            {/* Category Filter */}
            <div className="w-full sm:w-48">
              <CustomSelect
                options={categories}
                value={categoryFilter}
                onChange={(val) => setCategoryFilter(val)}
                theme="goat"
              />
            </div>
          </div>

          {/* Add Product Button */}
          <Link
            href="/admin/products/new"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-brand-black hover:bg-goat-primary text-white font-semibold text-sm h-10 px-4 rounded-xl transition-colors duration-200 shadow-sm"
          >
            <Plus size={16} />
            <span>Add Product</span>
          </Link>
        </div>

        {/* List / Table */}
        <div className="bg-white border border-brand-border rounded-2xl shadow-card overflow-hidden">
          {isLoading ? (
            <div className="p-12 text-center text-brand-gray flex flex-col items-center gap-3">
              <div className="animate-spin text-goat-primary">
                <ShoppingBag size={40} />
              </div>
              <p className="text-sm font-semibold">Loading products...</p>
            </div>
          ) : error ? (
            <div className="p-12 text-center text-red-600">
              <p className="text-sm font-semibold">{error}</p>
              <button
                onClick={fetchProductsAndCategories}
                className="mt-2 text-xs font-semibold underline text-brand-black"
              >
                Try Again
              </button>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="p-12 text-center text-brand-gray">
              <ShoppingBag size={40} className="mx-auto mb-3 text-neutral-300" />
              <p className="text-sm font-semibold">No products found</p>
              <p className="text-xs mt-1">Try refining your filters or add a new product.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-brand-light-gray text-brand-gray font-semibold text-xs border-b border-brand-border">
                    <th className="px-4 md:px-6 py-3 w-16">Preview</th>
                    <th className="px-4 md:px-6 py-3">Name</th>
                    <th className="px-4 md:px-6 py-3">Category</th>
                    <th className="px-4 md:px-6 py-3">Price</th>
                    <th className="px-4 md:px-6 py-3">Stock</th>
                    <th className="px-4 md:px-6 py-3">Status</th>
                    <th className="px-4 md:px-6 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-brand-border text-sm">
                  {filteredProducts.map((product) => (
                    <tr key={product._id} className="hover:bg-brand-light-gray/50 transition-colors">
                      <td className="px-4 md:px-6 py-3">
                        <div className="w-10 h-10 rounded-lg overflow-hidden border border-brand-border bg-brand-light-gray relative">
                          {product.images?.[0] ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={product.images[0]}
                              alt={product.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-neutral-400">
                              <ShoppingBag size={20} />
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-4 md:px-6 py-4">
                        <div className="font-semibold text-brand-black flex items-center gap-2">
                          <span>{product.name}</span>
                          {product.isFeatured && (
                            <span className="bg-goat-tint text-goat-text text-[10px] font-bold px-1.5 py-0.5 rounded border border-goat-primary/10 shrink-0">
                              Featured
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 md:px-6 py-4 text-brand-gray">
                        {product.category?.name || "Uncategorized"}
                      </td>
                      <td className="px-4 md:px-6 py-4 font-semibold text-brand-black">
                        {product.discountPrice ? (
                          <div className="flex flex-col">
                            <span>₹{product.discountPrice}</span>
                            <span className="text-[10px] text-brand-gray line-through">₹{product.price}</span>
                          </div>
                        ) : (
                          <span>₹{product.price}</span>
                        )}
                      </td>
                      <td className="px-4 md:px-6 py-4">
                        <span className={`font-semibold ${product.stock <= 3 ? "text-red-600" : "text-brand-black"}`}>
                          {product.stock}
                        </span>
                      </td>
                      <td className="px-4 md:px-6 py-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
                            product.isActive
                              ? "bg-green-50 text-green-800 border-green-200"
                              : "bg-gray-50 text-gray-800 border-gray-200"
                          }`}
                        >
                          {product.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="px-4 md:px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/admin/products/${product._id}`}
                            className="p-1.5 hover:bg-brand-light-gray text-brand-black hover:text-goat-primary rounded transition-colors"
                            title="Edit"
                          >
                            <Pencil size={16} />
                          </Link>
                          <button
                            onClick={() => handleDeleteClick(product._id)}
                            className="p-1.5 hover:bg-red-50 text-brand-gray hover:text-red-600 rounded transition-colors"
                            title="Delete"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

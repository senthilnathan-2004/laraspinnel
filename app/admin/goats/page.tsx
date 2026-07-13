"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import AdminTopbar from "@/components/admin/AdminTopbar";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import { Plus, Search, Pencil, Trash2, SlidersHorizontal, ArrowUpDown } from "lucide-react";
import { Horse } from "@phosphor-icons/react";

interface GoatVariety {
  _id: string;
  name: string;
  breed: string;
  priceEstimate: string;
  weightRange: string;
  isActive: boolean;
  isFeatured: boolean;
  images: string[];
}

export default function AdminGoatsPage() {
  const [goats, setGoats] = useState<GoatVariety[]>([]);
  const [filteredGoats, setFilteredGoats] = useState<GoatVariety[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const fetchGoats = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/goats");
      if (res.ok) {
        const data = await res.json();
        setGoats(data);
        setFilteredGoats(data);
      } else {
        setError("Failed to fetch goat varieties");
      }
    } catch (err) {
      setError("Failed to fetch goat varieties");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchGoats();
  }, []);

  useEffect(() => {
    const results = goats.filter(
      (goat) =>
        goat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        goat.breed.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredGoats(results);
  }, [searchTerm, goats]);

  const handleDelete = async (id: string) => {
    setConfirmDeleteId(id);
  };

  const doDelete = async () => {
    if (!confirmDeleteId) return;
    const id = confirmDeleteId;
    setConfirmDeleteId(null);
    try {
      const res = await fetch(`/api/admin/goats/${id}`, { method: "DELETE" });
      if (res.ok) {
        setGoats(goats.filter((g) => g._id !== id));
      } else {
        setError("Failed to delete goat variety");
      }
    } catch (err) {
      setError("Failed to delete goat variety");
    }
  };

  return (
    <div className="flex-1 flex flex-col min-h-screen">
      <ConfirmDialog
        isOpen={!!confirmDeleteId}
        title="Delete Goat Variety"
        message="Are you sure you want to delete this goat variety? This action cannot be undone."
        confirmLabel="Delete"
        onConfirm={doDelete}
        onCancel={() => setConfirmDeleteId(null)}
      />
      <AdminTopbar title="Goat Varieties" />

      <div className="flex-1 p-3 md:p-6 space-y-6 w-full">
        {/* Header Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Search */}
          <div className="relative w-full sm:max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-brand-gray">
              <Search size={16} />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name or breed..."
              className="w-full h-10 pl-9 pr-4 bg-white border border-brand-border rounded-xl text-sm text-brand-black focus:ring-2 focus:ring-goat-primary outline-none transition-all"
            />
          </div>

          {/* Add New Button */}
          <Link
            href="/admin/goats/new"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-brand-black hover:bg-goat-primary text-white font-semibold text-sm h-10 px-4 rounded-xl transition-colors duration-200 shadow-sm"
          >
            <Plus size={16} />
            <span>Add New Variety</span>
          </Link>
        </div>

        {/* List / Table */}
        <div className="bg-white border border-brand-border rounded-2xl shadow-card overflow-hidden">
          {isLoading ? (
            <div className="p-12 text-center text-brand-gray flex flex-col items-center gap-3">
              <div className="animate-spin text-goat-primary">
                <Horse size={40} weight="duotone" />
              </div>
              <p className="text-sm font-semibold">Loading varieties...</p>
            </div>
          ) : error ? (
            <div className="p-12 text-center text-red-600">
              <p className="text-sm font-semibold">{error}</p>
              <button
                onClick={fetchGoats}
                className="mt-2 text-xs font-semibold underline text-brand-black"
              >
                Try Again
              </button>
            </div>
          ) : filteredGoats.length === 0 ? (
            <div className="p-12 text-center text-brand-gray">
              <Horse size={40} weight="duotone" className="mx-auto mb-3 text-neutral-300" />
              <p className="text-sm font-semibold">No varieties found</p>
              <p className="text-xs mt-1">Try refining your search terms or add a new variety.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-brand-light-gray text-brand-gray font-semibold text-xs border-b border-brand-border">
                    <th className="px-4 md:px-6 py-3 w-16">Preview</th>
                    <th className="px-4 md:px-6 py-3">Name</th>
                    <th className="px-4 md:px-6 py-3">Breed</th>
                    <th className="px-4 md:px-6 py-3">Price Estimate</th>
                    <th className="px-4 md:px-6 py-3">Weight Class</th>
                    <th className="px-4 md:px-6 py-3">Status</th>
                    <th className="px-4 md:px-6 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-brand-border text-sm">
                  {filteredGoats.map((goat) => (
                    <tr key={goat._id} className="hover:bg-brand-light-gray/50 transition-colors">
                      <td className="px-4 md:px-6 py-3">
                        <div className="w-10 h-10 rounded-lg overflow-hidden border border-brand-border bg-brand-light-gray">
                          {goat.images?.[0] ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={goat.images[0]}
                              alt={goat.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-neutral-400">
                              <Horse size={20} />
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-4 md:px-6 py-4">
                        <div className="font-semibold text-brand-black flex items-center gap-2">
                          <span>{goat.name}</span>
                          {goat.isFeatured && (
                            <span className="bg-goat-tint text-goat-text text-[10px] font-bold px-1.5 py-0.5 rounded border border-goat-primary/10">
                              Featured
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 md:px-6 py-4 text-brand-gray">{goat.breed}</td>
                      <td className="px-4 md:px-6 py-4 font-semibold text-brand-black">
                        {goat.priceEstimate}
                      </td>
                      <td className="px-4 md:px-6 py-4 text-brand-gray">{goat.weightRange}</td>
                      <td className="px-4 md:px-6 py-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
                            goat.isActive
                              ? "bg-green-50 text-green-800 border-green-200"
                              : "bg-gray-50 text-gray-800 border-gray-200"
                          }`}
                        >
                          {goat.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="px-4 md:px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/admin/goats/${goat._id}`}
                            className="p-1.5 hover:bg-brand-light-gray text-brand-black hover:text-goat-primary rounded transition-colors"
                            title="Edit"
                          >
                            <Pencil size={16} />
                          </Link>
                          <button
                            onClick={() => handleDelete(goat._id)}
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

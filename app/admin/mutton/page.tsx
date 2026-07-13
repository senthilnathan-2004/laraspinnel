"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import AdminTopbar from "@/components/admin/AdminTopbar";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import { Plus, Search, Pencil, Trash2, Beef } from "lucide-react";

interface MuttonPack {
  _id: string;
  name: string;
  price: string;
  districtsAvailable: string[];
  isActive: boolean;
  isFeatured: boolean;
  images: string[];
}

export default function AdminMuttonPage() {
  const [packs, setPacks] = useState<MuttonPack[]>([]);
  const [filteredPacks, setFilteredPacks] = useState<MuttonPack[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const fetchPacks = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/mutton");
      if (res.ok) {
        const data = await res.json();
        setPacks(data);
        setFilteredPacks(data);
      } else {
        setError("Failed to fetch mutton packs");
      }
    } catch (err) {
      setError("Failed to fetch mutton packs");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPacks();
  }, []);

  useEffect(() => {
    const results = packs.filter((pack) =>
      pack.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredPacks(results);
  }, [searchTerm, packs]);

  const handleDelete = async (id: string) => {
    setConfirmDeleteId(id);
  };

  const doDelete = async () => {
    if (!confirmDeleteId) return;
    const id = confirmDeleteId;
    setConfirmDeleteId(null);
    try {
      const res = await fetch(`/api/admin/mutton/${id}`, { method: "DELETE" });
      if (res.ok) {
        setPacks(packs.filter((p) => p._id !== id));
      } else {
        setError("Failed to delete mutton pack");
      }
    } catch (err) {
      setError("Failed to delete mutton pack");
    }
  };

  return (
    <div className="flex-1 flex flex-col min-h-screen">
      <ConfirmDialog
        isOpen={!!confirmDeleteId}
        title="Delete Mutton Pack"
        message="Are you sure you want to delete this mutton pack? This action cannot be undone."
        confirmLabel="Delete"
        onConfirm={doDelete}
        onCancel={() => setConfirmDeleteId(null)}
      />
      <AdminTopbar title="Mutton Packs" />

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
              placeholder="Search mutton packs..."
              className="w-full h-10 pl-9 pr-4 bg-white border border-brand-border rounded-xl text-sm text-brand-black focus:ring-2 focus:ring-mutton-primary outline-none transition-all"
            />
          </div>

          {/* Add New Button */}
          <Link
            href="/admin/mutton/new"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-brand-black hover:bg-mutton-primary text-white font-semibold text-sm h-10 px-4 rounded-xl transition-colors duration-200 shadow-sm"
          >
            <Plus size={16} />
            <span>Add Mutton Pack</span>
          </Link>
        </div>

        {/* List / Table */}
        <div className="bg-white border border-brand-border rounded-2xl shadow-card overflow-hidden">
          {isLoading ? (
            <div className="p-12 text-center text-brand-gray flex flex-col items-center gap-3">
              <div className="animate-spin text-mutton-primary">
                <Beef size={40} />
              </div>
              <p className="text-sm font-semibold">Loading packs...</p>
            </div>
          ) : error ? (
            <div className="p-12 text-center text-red-600">
              <p className="text-sm font-semibold">{error}</p>
              <button
                onClick={fetchPacks}
                className="mt-2 text-xs font-semibold underline text-brand-black"
              >
                Try Again
              </button>
            </div>
          ) : filteredPacks.length === 0 ? (
            <div className="p-12 text-center text-brand-gray">
              <Beef size={40} className="mx-auto mb-3 text-neutral-300" />
              <p className="text-sm font-semibold">No mutton packs found</p>
              <p className="text-xs mt-1">Add a new package pack to make it available for order.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-brand-light-gray text-brand-gray font-semibold text-xs border-b border-brand-border">
                    <th className="px-4 md:px-6 py-3 w-16">Preview</th>
                    <th className="px-4 md:px-6 py-3">Name</th>
                    <th className="px-4 md:px-6 py-3">Price / Rate</th>
                    <th className="px-4 md:px-6 py-3">Districts Coverage</th>
                    <th className="px-4 md:px-6 py-3">Status</th>
                    <th className="px-4 md:px-6 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-brand-border text-sm">
                  {filteredPacks.map((pack) => (
                    <tr key={pack._id} className="hover:bg-brand-light-gray/50 transition-colors">
                      <td className="px-4 md:px-6 py-3">
                        <div className="w-10 h-10 rounded-lg overflow-hidden border border-brand-border bg-brand-light-gray">
                          {pack.images?.[0] ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={pack.images[0]}
                              alt={pack.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-neutral-400">
                              <Beef size={20} />
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-4 md:px-6 py-4">
                        <div className="font-semibold text-brand-black flex items-center gap-2">
                          <span>{pack.name}</span>
                          {pack.isFeatured && (
                            <span className="bg-mutton-tint text-mutton-text text-[10px] font-bold px-1.5 py-0.5 rounded border border-mutton-primary/10">
                              Featured
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 md:px-6 py-4 font-semibold text-brand-black">
                        {pack.price}
                      </td>
                      <td className="px-4 md:px-6 py-4">
                        <div className="flex flex-wrap gap-1 max-w-xs">
                          {pack.districtsAvailable && pack.districtsAvailable.length > 0 ? (
                            pack.districtsAvailable.map((d, idx) => (
                              <span
                                key={idx}
                                className="bg-neutral-100 text-neutral-800 text-[10px] px-1.5 py-0.5 rounded font-medium border border-neutral-200"
                              >
                                {d}
                              </span>
                            ))
                          ) : (
                            <span className="text-brand-gray text-xs italic">Inherited from settings</span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 md:px-6 py-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
                            pack.isActive
                              ? "bg-green-50 text-green-800 border-green-200"
                              : "bg-gray-50 text-gray-800 border-gray-200"
                          }`}
                        >
                          {pack.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="px-4 md:px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/admin/mutton/${pack._id}`}
                            className="p-1.5 hover:bg-brand-light-gray text-brand-black hover:text-mutton-primary rounded transition-colors"
                            title="Edit"
                          >
                            <Pencil size={16} />
                          </Link>
                          <button
                            onClick={() => handleDelete(pack._id)}
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

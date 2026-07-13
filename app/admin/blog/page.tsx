"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import AdminTopbar from "@/components/admin/AdminTopbar";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import { Plus, Search, Pencil, Trash2, FileText, Calendar, User } from "lucide-react";

interface BlogPost {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  author: string;
  isPublished: boolean;
  publishedAt?: string;
  createdAt: string;
}

export default function AdminBlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const fetchPosts = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/blog");
      if (res.ok) {
        const data = await res.json();
        setPosts(data);
        setFilteredPosts(data);
      } else {
        setError("Failed to fetch blog posts");
      }
    } catch (err) {
      setError("Failed to fetch blog posts");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  useEffect(() => {
    const results = posts.filter(
      (post) =>
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredPosts(results);
  }, [searchTerm, posts]);

  const handleDelete = async (id: string) => {
    setConfirmDeleteId(id);
  };

  const doDelete = async () => {
    if (!confirmDeleteId) return;
    const id = confirmDeleteId;
    setConfirmDeleteId(null);
    try {
      const res = await fetch(`/api/admin/blog/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setPosts(posts.filter((p) => p._id !== id));
      } else {
        setError("Failed to delete blog post");
      }
    } catch (err) {
      setError("Failed to delete blog post");
    }
  };

  return (
    <div className="flex-1 flex flex-col min-h-screen">
      <ConfirmDialog
        isOpen={!!confirmDeleteId}
        title="Delete Blog Post"
        message="Are you sure you want to delete this blog post? This action cannot be undone."
        confirmLabel="Delete"
        onConfirm={doDelete}
        onCancel={() => setConfirmDeleteId(null)}
      />
      <AdminTopbar title="Blog Manager" />

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
              placeholder="Search blog posts..."
              className="w-full h-10 pl-9 pr-4 bg-white border border-brand-border rounded-xl text-sm text-brand-black focus:ring-2 focus:ring-goat-primary outline-none transition-all"
            />
          </div>

          {/* Add New Button */}
          <Link
            href="/admin/blog/new"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-brand-black hover:bg-goat-primary text-white font-semibold text-sm h-10 px-4 rounded-xl transition-colors duration-200 shadow-sm"
          >
            <Plus size={16} />
            <span>Create Article</span>
          </Link>
        </div>

        {/* List / Table */}
        <div className="bg-white border border-brand-border rounded-2xl shadow-card overflow-hidden">
          {isLoading ? (
            <div className="p-12 text-center text-brand-gray flex flex-col items-center gap-3">
              <div className="animate-spin text-goat-primary">
                <FileText size={40} />
              </div>
              <p className="text-sm font-semibold">Loading articles...</p>
            </div>
          ) : error ? (
            <div className="p-12 text-center text-red-600">
              <p className="text-sm font-semibold">{error}</p>
              <button
                onClick={fetchPosts}
                className="mt-2 text-xs font-semibold underline text-brand-black"
              >
                Try Again
              </button>
            </div>
          ) : filteredPosts.length === 0 ? (
            <div className="p-12 text-center text-brand-gray">
              <FileText size={40} className="mx-auto mb-3 text-neutral-300" />
              <p className="text-sm font-semibold">No blog posts found</p>
              <p className="text-xs mt-1">Start writing farm stories, recipes, or tips for your readers.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-brand-light-gray text-brand-gray font-semibold text-xs border-b border-brand-border">
                    <th className="px-4 md:px-6 py-3">Title</th>
                    <th className="px-4 md:px-6 py-3">Author</th>
                    <th className="px-4 md:px-6 py-3">Created</th>
                    <th className="px-4 md:px-6 py-3">Published Date</th>
                    <th className="px-4 md:px-6 py-3">Status</th>
                    <th className="px-4 md:px-6 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-brand-border text-sm">
                  {filteredPosts.map((post) => (
                    <tr key={post._id} className="hover:bg-brand-light-gray/50 transition-colors">
                      <td className="px-4 md:px-6 py-4 max-w-sm">
                        <div className="font-semibold text-brand-black line-clamp-1">{post.title}</div>
                        <div className="text-xs text-brand-gray line-clamp-1 mt-0.5">{post.excerpt}</div>
                      </td>
                      <td className="px-4 md:px-6 py-4 text-brand-gray">
                        <div className="flex items-center gap-1.5">
                          <User size={14} className="text-neutral-400" />
                          <span>{post.author}</span>
                        </div>
                      </td>
                      <td className="px-4 md:px-6 py-4 text-brand-gray">
                        {new Date(post.createdAt).toLocaleDateString("en-IN", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </td>
                      <td className="px-4 md:px-6 py-4 text-brand-gray">
                        {post.publishedAt ? (
                          <div className="flex items-center gap-1.5">
                            <Calendar size={14} className="text-neutral-400" />
                            <span>
                              {new Date(post.publishedAt).toLocaleDateString("en-IN", {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                              })}
                            </span>
                          </div>
                        ) : (
                          <span className="text-xs italic text-neutral-400">Not published</span>
                        )}
                      </td>
                      <td className="px-4 md:px-6 py-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
                            post.isPublished
                              ? "bg-green-50 text-green-800 border-green-200"
                              : "bg-amber-50 text-amber-800 border-amber-200"
                          }`}
                        >
                          {post.isPublished ? "Published" : "Draft"}
                        </span>
                      </td>
                      <td className="px-4 md:px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/admin/blog/${post._id}`}
                            className="p-1.5 hover:bg-brand-light-gray text-brand-black hover:text-goat-primary rounded transition-colors"
                            title="Edit"
                          >
                            <Pencil size={16} />
                          </Link>
                          <button
                            onClick={() => handleDelete(post._id)}
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

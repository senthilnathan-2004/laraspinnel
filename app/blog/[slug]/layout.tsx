import type { Metadata } from "next";
import type { ReactNode } from "react";
import { connectToDatabase } from "@/lib/db";
import BlogPost from "@/models/BlogPost";

type Props = {
  children: ReactNode;
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  try {
    await connectToDatabase();
    const post = await BlogPost.findOne({ slug });
    if (post) {
      const displayTitle = `${post.metaTitle || post.title} | Ragu Goat Farm Blog`;
      const displayDesc = post.metaDescription || post.excerpt;
      return {
        title: displayTitle,
        description: displayDesc,
        authors: [{ name: post.author || "Ragu Farm Team" }],
        keywords: [
          ...(post.tags || []),
          "goat farming tips",
          "mutton recipe Tamil Nadu",
          "Ragu Goat Farm blog",
        ],
        alternates: {
          canonical: `/blog/${slug}`,
        },
        openGraph: {
          title: displayTitle,
          description: displayDesc,
          type: "article",
          locale: "en_IN",
          siteName: "Ragu Goat Farm",
          images: post.coverImage ? [{ url: post.coverImage }] : [],
          publishedTime: post.publishedAt?.toISOString() || post.createdAt?.toISOString(),
        },
        twitter: {
          card: "summary_large_image",
          title: displayTitle,
          description: displayDesc,
        },
      };
    }
  } catch (error) {
    console.error("Error loading blog post metadata:", error);
  }
  return {
    title: "Farm Article | Goat Farming & Mutton Guide — Ragu Goat Farm Blog",
    description:
      "Read expert insights on goat breeds, naatu aadu mutton, Bakrid goat selection, and farm-fresh mutton.",
  };
}

export default function BlogDetailLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}

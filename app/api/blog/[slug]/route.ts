import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import BlogPost from "@/models/BlogPost";

export async function GET(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  try {
    await connectToDatabase();
    const { slug } = await params;

    const post = await BlogPost.findOne({ slug, isPublished: true });

    if (!post) {
      return NextResponse.json({ error: "Article not found" }, { status: 444 });
    }

    return NextResponse.json(post);
  } catch (error: any) {
    console.error("Public Blog Slug API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch article details" },
      { status: 500 }
    );
  }
}

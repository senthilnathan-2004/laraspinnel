import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import BlogPost from "@/models/BlogPost";

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();

    const { searchParams } = new URL(req.url);
    const limitStr = searchParams.get("limit");
    const tag = searchParams.get("tag");

    const query: any = { isPublished: true };

    if (tag && tag !== "All") {
      query.tags = { $in: [tag] };
    }

    let dbQuery = BlogPost.find(query).sort({ publishedAt: -1, createdAt: -1 });

    if (limitStr) {
      const limit = parseInt(limitStr);
      if (!isNaN(limit)) {
        dbQuery = dbQuery.limit(limit);
      }
    }

    const posts = await dbQuery;
    return NextResponse.json(posts);
  } catch (error: any) {
    console.error("Public Blog API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch blog posts" },
      { status: 500 }
    );
  }
}

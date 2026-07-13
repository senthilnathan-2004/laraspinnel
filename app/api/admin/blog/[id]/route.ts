import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import BlogPost from "@/models/BlogPost";
import { blogPostSchema } from "@/lib/validations";
import { slugify } from "@/lib/utils";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();
    const { id } = await params;

    const body = await req.json();
    const result = blogPostSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: "Validation failed", details: result.error.format() },
        { status: 400 }
      );
    }

    const { title, content, excerpt, coverImage, author, tags, metaTitle, metaDescription, isPublished } = result.data;

    const existingPost = await BlogPost.findById(id);
    if (!existingPost) {
      return NextResponse.json({ error: "Blog post not found" }, { status: 444 });
    }

    let slug = existingPost.slug;
    if (existingPost.title !== title) {
      slug = slugify(title);
      const slugExists = await BlogPost.findOne({ slug, _id: { $ne: id } });
      if (slugExists) {
        slug = `${slug}-${Math.floor(100 + Math.random() * 900)}`;
      }
    }

    // Determine publishedAt date
    let publishedAt = existingPost.publishedAt;
    if (isPublished && !existingPost.isPublished) {
      publishedAt = new Date();
    } else if (!isPublished) {
      publishedAt = undefined;
    }

    const updatedPost = await BlogPost.findByIdAndUpdate(
      id,
      {
        title,
        slug,
        content,
        excerpt,
        coverImage,
        author,
        tags,
        metaTitle,
        metaDescription,
        isPublished,
        publishedAt,
      },
      { new: true }
    );

    return NextResponse.json(updatedPost);
  } catch (error: any) {
    console.error("Admin Blog PUT error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to update blog post" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();
    const { id } = await params;

    const post = await BlogPost.findByIdAndDelete(id);
    if (!post) {
      return NextResponse.json({ error: "Blog post not found" }, { status: 444 });
    }

    return NextResponse.json({ message: "Blog post deleted successfully" });
  } catch (error: any) {
    console.error("Admin Blog DELETE error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to delete blog post" },
      { status: 500 }
    );
  }
}

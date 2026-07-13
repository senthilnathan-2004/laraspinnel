import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import SiteSettings from "@/models/SiteSettings";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();

    const settingsList = await SiteSettings.find({});
    
    // Map list [ { key: 'farm_name', value: '...' } ] to single object { farm_name: '...' }
    const settingsObject = settingsList.reduce((acc: any, curr) => {
      acc[curr.key] = curr.value;
      return acc;
    }, {});

    return NextResponse.json(settingsObject);
  } catch (error: any) {
    console.error("Admin Settings GET error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch site settings" },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();

    const body = await req.json(); // e.g. { farm_name: 'New Name', contact_phone: '...' }

    const updatePromises = Object.entries(body).map(([key, val]) => {
      return SiteSettings.findOneAndUpdate(
        { key },
        { value: String(val) },
        { upsert: true, new: true }
      );
    });

    await Promise.all(updatePromises);

    return NextResponse.json({ message: "Settings updated successfully" });
  } catch (error: any) {
    console.error("Admin Settings PUT error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to update site settings" },
      { status: 500 }
    );
  }
}

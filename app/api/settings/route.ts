import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import SiteSettings from "@/models/SiteSettings";

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();

    const settingsList = await SiteSettings.find({});
    
    // Map list [ { key: 'farm_name', value: '...' } ] to single object { farm_name: '...' }
    const settingsObject = settingsList.reduce((acc: any, curr) => {
      acc[curr.key] = curr.value;
      return acc;
    }, {});

    return NextResponse.json(settingsObject);
  } catch (error: any) {
    console.error("Public Settings API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch site settings" },
      { status: 500 }
    );
  }
}
export const revalidate = 60; // Cache and revalidate settings every 60s

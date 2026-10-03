import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const apiKey = process.env.IMGBB_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "IMGBB_API_KEY is missing in .env.local" },
        { status: 500 }
      );
    }

    const imgbbFormData = new FormData();
    imgbbFormData.append("image", file);

    // Upload to ImgBB
    const response = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
      method: "POST",
      body: imgbbFormData,
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(data.error?.message || "Failed to upload to ImgBB");
    }

    // data.data.url contains the direct image link
    return NextResponse.json({
      success: true,
      url: data.data.url,
    });
  } catch (error: any) {
    console.error("ImgBB upload error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to upload image" },
      { status: 500 }
    );
  }
}

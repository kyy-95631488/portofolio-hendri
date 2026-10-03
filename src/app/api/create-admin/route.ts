import { NextResponse } from "next/server";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase/config";

export async function GET() {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      "email@example.com",
      "123456"
    );
    return NextResponse.json({
      success: true,
      message: "User created successfully",
      email: userCredential.user.email,
    });
  } catch (error: any) {
    if (error.code === "auth/email-already-in-use") {
      return NextResponse.json({
        success: true,
        message: "User already exists",
      });
    }
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 400 }
    );
  }
}

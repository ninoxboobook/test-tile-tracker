import { NextRequest, NextResponse } from "next/server";
import { sendEmail } from "@/lib/ses";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { to, subject, html } = body;

    if (!to || !subject || !html) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const result = await sendEmail({ to, subject, html });
    return NextResponse.json(result);
  } catch (error: any) {
    console.error("Error in email API route:", error);
    return NextResponse.json(
      { error: error.message || "Failed to send email" },
      { status: 500 }
    );
  }
}

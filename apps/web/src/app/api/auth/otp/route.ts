import { NextResponse } from "next/server";
import { createOTP } from "@/lib/auth";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY || "re_j5qgw1v6_JCszH9JvCbwK8j7RmwzdpATK");

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email || typeof email !== "string" || !email.includes("@")) {
      return NextResponse.json({ error: "Valid email required" }, { status: 400 });
    }

    const code = createOTP(email);

    const fromEmail = process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev";
    
    // Send email using Resend
    const { data, error } = await resend.emails.send({
      from: `Klyrn <${fromEmail}>`,
      to: email,
      subject: "Your Klyrn verification code",
      html: `<div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Sign in to Klyrn</h2>
        <p>Your verification code is:</p>
        <h1 style="font-size: 32px; letter-spacing: 0.2em; color: #00D6A4; background: #0E1A22; padding: 20px; border-radius: 8px; text-align: center;">${code}</h1>
        <p style="color: #6B7682; font-size: 12px; margin-top: 20px;">This code will expire in 10 minutes.</p>
      </div>`,
    });

    if (error) {
      console.error("[OTP] Resend error:", error);
      return NextResponse.json({ error: error.message || "Failed to send email" }, { status: 500 });
    }

    // For demo/hackathon: OTP is logged to server console
    // In dev, also return it to the client so the flow works without email
    const isDev = process.env.NODE_ENV === "development";

    return NextResponse.json({
      success: true,
      message: "Verification code sent to your email",
      ...(isDev ? { code } : {}), // Only expose in dev
    });
  } catch (err: any) {
    console.error("[OTP] Route error:", err);
    return NextResponse.json({ error: "Failed to send code" }, { status: 500 });
  }
}

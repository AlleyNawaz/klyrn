import { NextResponse } from "next/server";
import { createOTP } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email || typeof email !== "string" || !email.includes("@")) {
      return NextResponse.json({ error: "Valid email required" }, { status: 400 });
    }

    const code = createOTP(email);

    // In production, send via Resend / SendGrid / SES:
    // await resend.emails.send({
    //   from: "Klyrn <verify@klyrn.xyz>",
    //   to: email,
    //   subject: "Your Klyrn verification code",
    //   html: `<p>Your code is: <strong>${code}</strong></p>`,
    // });

    // For demo/hackathon: OTP is logged to server console
    // In dev, also return it to the client so the flow works without email
    const isDev = process.env.NODE_ENV === "development";

    return NextResponse.json({
      success: true,
      message: "Verification code sent to your email",
      ...(isDev ? { code } : {}), // Only expose in dev
    });
  } catch (err) {
    return NextResponse.json({ error: "Failed to send code" }, { status: 500 });
  }
}

import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "Klyrn | Get paid. No middlemen. No 8-week disputes.",
  description: "Klyrn is escrow for freelancers, with AI that resolves disputes in 8 seconds, not 8 weeks. 1% fee, instant USDC payouts on Solana. No chargebacks.",
  keywords: ["freelance", "escrow", "payments", "dispute resolution", "AI", "Solana", "Klyrn"],
  openGraph: {
    title: "Klyrn | Get paid. No middlemen.",
    description: "Escrow for freelancers with an AI judge. 1% fee, instant payouts.",
    url: "https://klyrn.xyz",
    siteName: "Klyrn",
    type: "website",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Klyrn | Get paid. No middlemen." }],
  },
  twitter: {
    card: "summary_large_image",
    site: "@klyrn",
    title: "Klyrn | Get paid. No middlemen.",
    description: "Escrow for freelancers with an AI judge. 1% fee, instant payouts.",
  },
  icons: {
    icon: "/icon.png",
    apple: "/apple-icon.png",
    shortcut: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] antialiased">
        {children}
      </body>
    </html>
  );
}

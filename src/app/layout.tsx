import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "🚀 Space Shooter",
  description: "Exciting space shooting game in your browser. Test your skills and beat high scores!",
  keywords: ["Space Shooter", "Arcade Game", "Online Game", "HTML5 Game", "Next.js Game"],
  authors: [{ name: "Thoeurn Ratha" }],
  viewport: "width=device-width, initial-scale=1.0",
  robots: "index, follow",
  openGraph: {
    title: "🚀 Space Shooter",
    description: "Exciting space shooting game in your browser. Test your skills and beat high scores!",
    url: "https://space-shooter-7yzp.vercel.app/",
    siteName: "Space Shooter",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="theme-color" content="#0f172a" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import { Geist, Geist_Mono, Noto_Sans_Thai } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const noto_sans_thai = Noto_Sans_Thai();

export const metadata: Metadata = {
  title: "Shanet",
  description: "Shanet, a chat application for those who thinks Shane is a nice guy.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${noto_sans_thai.className} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}

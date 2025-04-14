import type { Metadata } from "next";
import { Geist, Geist_Mono, Noto_Sans_Thai } from "next/font/google";
import "./globals.css";
import GlobalLoadingProvider from "@/components/provider/GlobalLoadingProvider";
import UsernameProvider from "@/components/provider/UsernameProvider";
import GroupMemberContextProvider from "@/components/provider/GroupMemberProvider";
import SocketProvider from "@/components/provider/SocketProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const noto_sans_thai = Noto_Sans_Thai({
  subsets: ["thai"],
});

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
        <SocketProvider>
          <GlobalLoadingProvider>
            <UsernameProvider>
              <GroupMemberContextProvider>
                {children}
              </GroupMemberContextProvider>
            </UsernameProvider>
          </GlobalLoadingProvider>
        </SocketProvider>
      </body>
    </html>
  );
}

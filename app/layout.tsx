
import type { Metadata } from "next";
import { Geist} from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "D2DMap",
  description: "Map for D2D",
  manifest: "/manifest.webmanifest",
  themeColor: "#1DB2ED",
  icons: [
    { rel: "icon", url: "/logo192.png", sizes: "192x192" },
    { rel: "apple-touch-icon", url: "/logo512.png", sizes: "512x512" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}

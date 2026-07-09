import type { Metadata, Viewport } from "next";
import { Montserrat, Open_Sans } from "next/font/google";
import { MobileNav } from "@/components/MobileNav";
import "./globals.css";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

const openSans = Open_Sans({
  variable: "--font-open-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
});

export const metadata: Metadata = {
  title: "CentreCourt · Team Wellness",
  description: "CentreCourt team wellness leaderboard, powered by Oura Ring data.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${montserrat.variable} ${openSans.variable}`}>
      <body>
        {children}
        <MobileNav />
      </body>
    </html>
  );
}

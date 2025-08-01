import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import HydrationProvider from "@/components/providers/hydration-provider";
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
  title: "VigorLog - Athleten-Monitoring für Jugendliche",
  description: "Progressive Web App für das tägliche Monitoring jugendlicher Athleten (14-18 Jahre). Verletzungsprävention durch kontinuierliche Gesundheitsüberwachung.",
  icons: {
    icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><rect width='100' height='100' fill='%2339FF14'/><text x='50' y='65' text-anchor='middle' fill='black' font-size='60' font-weight='bold'>V</text></svg>",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de">
      <head>
        <script 
          src="https://kit.fontawesome.com/ee524abbd1.js" 
          crossOrigin="anonymous"
          async
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <HydrationProvider>
          {children}
        </HydrationProvider>
      </body>
    </html>
  );
}

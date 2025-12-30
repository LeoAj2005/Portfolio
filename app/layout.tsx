import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Ajay | Creative Technologist",
  description: "Portfolio of Ajay - Design & Engineering",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Google Sans Imports */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link 
          href="https://fonts.googleapis.com/css2?family=Google+Sans:ital,opsz,wght@0,17..18,400..700;1,17..18,400..700&display=swap" 
          rel="stylesheet" 
        />
      </head>
      <body className="antialiased bg-[#f5f3ee] text-slate-900 overflow-x-hidden">
        {children}
      </body>
    </html>
  );
}
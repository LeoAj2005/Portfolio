import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Ajay | Portfolio",
  description: "Frontend Architect & Creative Technologist",
  icons: {
    icon: "/Avatar.png",
    shortcut: "/Avatar.png",
    apple: "/Avatar.png",
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
        {/* CACHE BUSTER: The '?v=2' forces the browser to ignore the old cached icon */}
        <link rel="icon" href="/Avatar.png?v=2" type="image/png" sizes="any" />
        
        <script type="module" src="https://unpkg.com/ionicons@7.1.0/dist/ionicons/ionicons.esm.js" async></script>
        <script noModule src="https://unpkg.com/ionicons@7.1.0/dist/ionicons/ionicons.js" async></script>
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
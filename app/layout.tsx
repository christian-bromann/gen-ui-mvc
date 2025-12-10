import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "StreamFlow - AI-Powered Streaming Dashboard",
  description: "An experimental streaming service dashboard powered by AI agents that dynamically control the UI based on your interactions.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased bg-zinc-950 text-white min-h-screen">
        {children}
      </body>
    </html>
  );
}

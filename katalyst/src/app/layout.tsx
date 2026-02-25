import type { Metadata } from "next";
import "./globals.css";
import Sidebar from "@/components/Sidebar";

export const metadata: Metadata = {
  title: "Katalyst — Accelerate Your PM Career",
  description:
    "The ultimate platform for Product Managers to sharpen skills, ace interviews, and master AI product management.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased font-sans">
        <Sidebar />
        <main className="md:ml-64 min-h-screen">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 pt-16 md:pt-6">
            {children}
          </div>
        </main>
      </body>
    </html>
  );
}

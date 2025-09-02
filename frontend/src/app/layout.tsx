import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";

// This Metadata is used to set the title and description of the page for SEO benefits and also used for social sharing
export const metadata: Metadata = {
  title: "Travel Dashboard - Plan Your Perfect Journey",
  description: "Create, manage, and organize your travel plans with our intuitive travel dashboard application.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
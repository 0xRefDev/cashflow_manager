import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Cashflow | Expenses Manager",
  description: "Manage your expenses with cashflow",
  authors: [{ name: "0xRef" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`h-full antialiased scroll-smooth`}
    >
      <body className="min-h-full flex flex-col scroll-smooth">{children}</body>
    </html>
  );
}

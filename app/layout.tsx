import type { Metadata } from "next";
import "./globals.css";
import ToastProvider from "@/components/ToasterComponent";

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
      data-scroll-behavior="smooth"
      className={`h-full antialiased scroll-smooth`}
    >
      <body className="min-h-full flex flex-col scroll-smooth">
        {children}
        <ToastProvider />
      </body>
    </html>
  );
}

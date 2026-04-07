import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Saviour Mechatronics | Electronics & Automation Components",
  description:
    "Browse and order quality mechatronics components — microcontrollers, sensors, motors, PLC parts and more. WhatsApp-assisted ordering for personalized service.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body className={`${inter.className} min-h-full flex flex-col antialiased bg-gray-50`}>
        {children}
      </body>
    </html>
  );
}

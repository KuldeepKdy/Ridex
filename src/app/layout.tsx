import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Provider from "@/lib/Provider";
import ReduxProvider from "@/redux/ReduxProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "RIDEX - Smart Vehicle Booking Platform",
  description:
    "RIDEX is a modern multi-vendor vehicle booking platform that allows users to easily book cars, bikes and commercial vehicles online. With a user-friendly interface and advanced features, RIDEX provides a seamless booking experience for both customers and vendors.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Provider>
          <ReduxProvider>
          {children}
          </ReduxProvider>
          </Provider>
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import { Jost } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/lib/theme-provider"
import { Toaster } from "sonner";
import {ClerkProvider} from '@clerk/nextjs'

const jost = Jost({
  subsets: ["latin"],
  variable: "--font-jost",
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "Dzin AI",
  description: "Dzin AI - The ultimate AI-powered mobile design platform for creators.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body
          className={`${jost.variable} antialiased`}
          >
             <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
              >
              {children}
              <Toaster richColors position="top-right" />
            </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}

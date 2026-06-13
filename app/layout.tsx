import type { Metadata } from "next";
import { Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Nav } from "@/components/layout/nav";
import { Footer } from "@/components/layout/footer";
import { PersonJsonLd } from "@/components/json-ld";

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://ayoo.dev"),
  title: {
    default: "Ayo Owolabi",
    template: "%s · Ayo Owolabi",
  },
  description:
    "Technical founder building a portfolio of products and writing about where technology is going.",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://ayoo.dev",
    siteName: "Ayo Owolabi",
    images: [{ url: "/api/og", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    creator: "@ayoowolabi",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={geistMono.variable}
      suppressHydrationWarning
    >
      <body>
        <PersonJsonLd />
        <ThemeProvider>
          <Nav />
          <main className="flex-1">{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}

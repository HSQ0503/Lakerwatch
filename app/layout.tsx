import type { Metadata } from "next";
import { Montserrat, DM_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { Analytics } from "@vercel/analytics/next";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jb-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "LakerWatch",
  description: "School utility dashboard for Windermere Preparatory School",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `try{if(localStorage.getItem("lakerwatch-theme")==="dark")document.documentElement.classList.add("dark")}catch{}`,
          }}
        />
      </head>
      <body
        className={`${montserrat.variable} ${dmSans.variable} ${jetbrainsMono.variable} min-h-screen font-body antialiased`}
      >
        <Navbar />
        <main className="mx-auto max-w-5xl px-4 pb-12 pt-20">{children}</main>
        <Analytics />
      </body>
    </html>
  );
}

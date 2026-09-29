import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/react";
import { Inter, Source_Serif_4 } from "next/font/google";
import { cookies } from "next/headers";

// @ts-ignore: Cannot find module or type declarations for side-effect import of './globals.css'.
import "./globals.css";
import React from "react";
import { LOCALE_COOKIE, parseLocale } from "@/lib/locale";

export const metadata: Metadata = {
  title: "Ben Schumacher — Lebenslauf",
  description:
    "Lebenslauf von Ben Schumacher, Auszubildender Fachinformatiker für Systemintegration in Köln.",
};

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans",
});

const sourceSerif = Source_Serif_4({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-serif",
});

const themeInitScript = `(function(){try{var t=localStorage.getItem('theme-preference');var d=t?t==='dark':window.matchMedia('(prefers-color-scheme: dark)').matches;if(d){document.documentElement.classList.add('dark');}}catch(e){}})();`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale = parseLocale(cookies().get(LOCALE_COOKIE)?.value);

  return (
    <html
      lang={locale}
      className={`${inter.variable} ${sourceSerif.variable} scroll-smooth`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="min-h-screen bg-background font-sans">
        {children}
        <Analytics />
      </body>
    </html>
  );
}

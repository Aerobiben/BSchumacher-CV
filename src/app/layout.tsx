import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/react";
import { Inter } from "next/font/google";

// @ts-ignore: Cannot find module or type declarations for side-effect import of './globals.css'.
import "./globals.css";
import React from "react";

export const metadata: Metadata = {
  title: "Ben Schumacher — CV",
  description: "Digitale Bewerbungswebsite",
};

// If loading a variable font, you don't need to specify the font weight
const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

// Setzt das Theme vor dem ersten Paint, um ein Aufblitzen (FOUC) zu vermeiden.
const themeInitScript = `(function(){try{var t=localStorage.getItem('theme-preference');var d=t?t==='dark':window.matchMedia('(prefers-color-scheme: dark)').matches;if(d){document.documentElement.classList.add('dark');}}catch(e){}})();`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="de" className={inter.className} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}

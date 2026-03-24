import type { ReactNode } from "react";
import { Fraunces } from "next/font/google";

import "../styles/globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  display: "swap",
});

export const metadata = {
  title: "Book Earth",
  description: "A literary map explorer MVP",
};

type RootLayoutProps = {
  children: ReactNode;
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <head>
        <link rel="stylesheet" href="/cesium/Widgets/widgets.css" />
      </head>
      <body className={fraunces.className}>
        <main className="min-h-screen grid gap-6 p-8 lg:grid-cols-[minmax(280px,360px)_minmax(0,1fr)]">
          {children}
        </main>
      </body>
    </html>
  );
}

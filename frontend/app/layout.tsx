import type { ReactNode } from "react";

import "./globals.css";

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
      <body>
        <main className="page">{children}</main>
      </body>
    </html>
  );
}

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
      <head>
        <link rel="stylesheet" href="/cesium/Widgets/widgets.css" />
      </head>
      <body>
        <main className="app">{children}</main>
      </body>
    </html>
  );
}

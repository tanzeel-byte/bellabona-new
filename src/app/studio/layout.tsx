import type { Metadata } from "next";

import "../globals.css";

export const metadata: Metadata = {
  title: "Studio · Bella&Bona",
  robots: { index: false, follow: false },
};

export default function StudioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

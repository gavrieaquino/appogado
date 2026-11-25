import type { Metadata, Viewport } from "next";
import "../design/tokens.css";
import "./globals.css";
import { publicSans, spaceGrotesk } from "./fonts";

export const metadata: Metadata = {
  title: "APPogado prototype",
  description: "Demonstration prototype on sample data. Not legal advice.",
};

export const viewport: Viewport = { width: "device-width", initialScale: 1 };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${spaceGrotesk.variable} ${publicSans.variable}`}>
      <body>
        <a href="#main" className="skip-link">Skip to content</a>
        {children}
      </body>
    </html>
  );
}

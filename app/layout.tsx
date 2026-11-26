import type { Metadata, Viewport } from "next";
import "../design/tokens.css";
import "./globals.css";
import { publicSans, spaceGrotesk } from "./fonts";

export const metadata: Metadata = {
  title: "APPogado prototype",
  description: "Demonstration prototype on sample data. Not legal advice.",
};

// "only light" also tells Chrome's Auto Dark Mode not to darken the page (D33).
export const viewport: Viewport = { width: "device-width", initialScale: 1, colorScheme: "only light", themeColor: "#4a2bb5" };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" data-theme="light" className={`${spaceGrotesk.variable} ${publicSans.variable}`}>
      <body>
        <a href="#main" className="skip-link">Skip to content</a>
        {children}
      </body>
    </html>
  );
}

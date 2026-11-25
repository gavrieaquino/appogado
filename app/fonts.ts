import localFont from "next/font/local";

// Self-hosted, Latin subset, variable weight (decision D28). No request to Google; ~52 KB total, cached.
export const spaceGrotesk = localFont({
  src: "../node_modules/@fontsource-variable/space-grotesk/files/space-grotesk-latin-wght-normal.woff2",
  weight: "300 700",
  display: "swap",
  variable: "--f-space-grotesk",
  fallback: ["system-ui", "sans-serif"],
});

export const publicSans = localFont({
  src: "../node_modules/@fontsource-variable/public-sans/files/public-sans-latin-wght-normal.woff2",
  weight: "100 900",
  display: "swap",
  variable: "--f-public-sans",
  fallback: ["system-ui", "sans-serif"],
});

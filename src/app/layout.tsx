import type { Metadata } from "next";
import { DM_Sans, Playfair_Display } from "next/font/google";
import { siteUrl } from "@/lib/site";
import "./globals.css";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

const description =
  "Live pizza catering in Brampton, Peel and the GTA. Fresh 12\" pizzas hand-stretched and baked in front of your guests at weddings, birthdays and corporate events.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Jass Pizza | Live Pizza Catering in Brampton & the GTA",
    template: "%s | Jass Pizza",
  },
  description,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "en_CA",
    siteName: "Jass Pizza",
    url: "/",
    title: "Jass Pizza | Live Pizza Catering in Brampton & the GTA",
    description,
  },
  twitter: { card: "summary_large_image" },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${dmSans.variable} ${playfair.variable} h-full antialiased scroll-smooth scroll-pt-24 motion-reduce:scroll-auto`}
      
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}

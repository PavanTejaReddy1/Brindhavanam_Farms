import type { Metadata } from "next";
import "./globals.css";
import Providers from "./providers";

export const metadata: Metadata = {
  title: "Brindhavanam Farms – Farm Fresh Milk Delivered Every Morning",
  description:
    "Freshly sourced farm milk delivered in eco-friendly glass bottles to your doorstep before sunrise. No preservatives. No plastic. Just pure, fresh dairy from local farms.",
  keywords: [
    "farm fresh milk",
    "glass bottle milk",
    "organic dairy Hyderabad",
    "doorstep milk delivery",
    "Brindhavanam Farms",
    "no preservatives milk",
  ],
  openGraph: {
    title: "Brindhavanam Farms – Farm Fresh Milk",
    description: "Farm fresh milk in glass bottles, delivered before 7 AM.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
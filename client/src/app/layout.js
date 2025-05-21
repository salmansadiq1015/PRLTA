import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "./context/authContext";
import { Toaster } from "react-hot-toast";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Prlta Fishing Competition - Ultimate Angling Experience",
  description:
    "Join the Prlta Fishing Competition and showcase your angling skills! Compete with top fishermen, win exciting prizes, and enjoy a thrilling fishing adventure.",
  keywords:
    "fishing competition, Prlta fishing, angling tournament, fishing contest, sport fishing, fishing event, fishing championship, best fishing competition, fishing prizes, competitive fishing, fishing derby, fishing challenge",
  author: "Salman Sadiq",
  robots: "index, follow",
  canonical: "https://www.prltafishing.com",
  og: {
    type: "website",
    title: "Prlta Fishing Competition - Ultimate Angling Experience",
    description:
      "Join the Prlta Fishing Competition and showcase your angling skills! Compete with top fishermen, win exciting prizes, and enjoy a thrilling fishing adventure.",
    url: "https://www.prltafishing.com",
    image: "/logo.png",
  },
  twitter: {
    card: "summary_large_image",
    site: "@PrltaFishing",
    title: "Prlta Fishing Competition - Ultimate Angling Experience",
    description:
      "Join the Prlta Fishing Competition and showcase your angling skills! Compete with top fishermen, win exciting prizes, and enjoy a thrilling fishing adventure.",
    image: "/logo.png",
  },
  language: "en-US",
};

export function generateViewport() {
  return "width=device-width, initial-scale=1.0";
}

export function generateThemeColor() {
  return "#074799";
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta charSet="UTF-8" />
        <meta name="author" content={metadata.author} />
        <meta name="description" content={metadata.description} />
        <meta name="keywords" content={metadata.keywords} />
        <meta name="robots" content={metadata.robots} />
        <link rel="canonical" href={metadata.canonical} />

        {/* Open Graph Metadata */}
        <meta property="og:type" content={metadata.og.type} />
        <meta property="og:title" content={metadata.og.title} />
        <meta property="og:description" content={metadata.og.description} />
        <meta property="og:url" content={metadata.og.url} />
        <meta property="og:image" content={metadata.og.image} />

        {/* Twitter Card Metadata */}
        <meta name="twitter:card" content={metadata.twitter.card} />
        <meta name="twitter:site" content={metadata.twitter.site} />
        <meta name="twitter:title" content={metadata.twitter.title} />
        <meta
          name="twitter:description"
          content={metadata.twitter.description}
        />
        <meta name="twitter:image" content={metadata.twitter.image} />

        {/* Favicon */}
        <link rel="icon" href="/logo.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/logo.png" />
        <link rel="manifest" href="/site.webmanifest" />

        <title>{metadata.title}</title>
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>
          {children}
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}

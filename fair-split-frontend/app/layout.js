import "./globals.css";

export const metadata = {
  title: "Fair Split 🤑",
  description: "Split trip expenses, settle up in the fewest payments possible.",
};

// Loaded via <link> instead of next/font/google so the build never depends on
// live network access to fonts.googleapis.com at build time.
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
        <link
          href="https://fonts.googleapis.com/css2?family=Baloo+2:wght@500;600;700;800&family=Nunito:wght@400;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-body text-ink">{children}</body>
    </html>
  );
}

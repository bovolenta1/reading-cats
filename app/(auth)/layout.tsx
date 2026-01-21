export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

export const metadata = {
  title: "Reading Cats",
  description: "Cozy reading, challenges and streaks",
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
};

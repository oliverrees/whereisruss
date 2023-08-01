import { Suspense } from "react";
import Loading from "./components/Loading";
import "./globals.css";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Where is Russ",
  description: "A map of the world showing where Russ is",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <body className={inter.className}>
        <Suspense fallback={<Loading />}>
        {children}
        </Suspense>
        </body>
    </html>
  );
}

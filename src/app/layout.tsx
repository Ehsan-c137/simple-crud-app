import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Providers from "@/providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
   title: "ecm",
   description: "simple crud application",
};

export default function RootLayout({
   children,
}: Readonly<{
   children: React.ReactNode;
}>) {
   return (
      <html lang="en">
         <body className={`${inter.className} min-h-screen`}>
            <main>
               <Providers>{children}</Providers>
            </main>
         </body>
      </html>
   );
}

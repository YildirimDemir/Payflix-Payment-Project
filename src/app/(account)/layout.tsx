import type { Metadata } from "next";
import "../globals.css";
import { getSession } from "next-auth/react";
import NextSessionProvider from "@/provider/NextSessionProvider";
import QueryProvider from "@/provider/QueryProvider";
import "@uploadthing/react/styles.css";
import Navbar from "@/components/ui/Navbar";

export const metadata: Metadata = {
  title: "Payflix",
  description: "Pay online faster",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getSession();

  return (
    <NextSessionProvider session={session}>
      <html lang="en">
        <body>
            <QueryProvider>
              <Navbar />
               {children}
            </QueryProvider>
        </body>
      </html>
    </NextSessionProvider>
  );
}
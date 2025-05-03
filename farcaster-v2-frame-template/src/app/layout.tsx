import type { Metadata } from "next";

import { getSession } from "../auth"
import "./globals.css";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "Tip Me",
  description: "Tip Me Frame",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getSession()
  
  return (
    <html lang="en">
      <body>
        <Providers session={session}>{children}</Providers>
      </body>
    </html>
  );
}

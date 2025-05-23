import type { Metadata } from "next";

import { getSession } from "~/auth"
import "~/app/globals.css";
import { Providers } from "~/app/providers";
import { Toaster } from "~/components/ui/toaster";

export const metadata: Metadata = {
  title: "Buy Hypercert",
  description: "Buy Hypercert Frame",
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
        <Providers session={session}>
          {children}
          <Toaster /> 
        </Providers>
      </body>
    </html>
  );
}

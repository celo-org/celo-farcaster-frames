import './globals.css';

export const metadata = {
  title: 'AI Accord Quiz',
  description: 'Discover your governance persona by answering a few quick questions!',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
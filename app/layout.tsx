import './globals.css';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Next-Gen Learning Studio',
  description: 'Hardware-accelerated student telemetry dashboard',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark h-full bg-zinc-950">
      <body className={`${inter.className} h-full min-h-screen m-0 p-0 antialiased bg-zinc-950 text-zinc-50 overflow-x-hidden`}>
        {children}
      </body>
    </html>
  );
}

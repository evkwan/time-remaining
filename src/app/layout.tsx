import './globals.css';
import type { Metadata } from 'next';
import { Fira_Sans_Condensed } from 'next/font/google';

const fira = Fira_Sans_Condensed({
  subsets: ['latin'],
  weight: ['400', '600'],
  style: ['normal', 'italic'],
});

export const metadata: Metadata = {
  title: 'Time Remaining',
  description: 'A simple countdown to the end of the year.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={fira.className}>{children}</body>
    </html>
  );
}

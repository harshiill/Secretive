/* eslint-disable @typescript-eslint/no-unused-vars */
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import AuthProvider from './context/AuthProvider';
import { toast, Toaster } from 'sonner';
const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Secreative',
  description: 'Real feedback from real people.',
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default async function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" >
      <AuthProvider>
        <body className={inter.className}>
          {children}
          <Toaster />
        </body>
      </AuthProvider>
    </html>
  );
}
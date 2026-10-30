import type { Metadata } from 'next';
import AppShell from '@/components/AppShell';

/**
 * App shell layout for all authenticated dashboard routes.
 * These pages are private and must not be indexed by search engines.
 */
export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
    googleBot: { index: false, follow: false },
  },
};

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AppShell>{children}</AppShell>;
}

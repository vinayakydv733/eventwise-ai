import type { Metadata } from 'next';
import { GeistSans } from 'geist/font/sans';
import './globals.css';

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://eventwiseai.com';
const OG_IMAGE = `${APP_URL}/og-image.png`;

export const metadata: Metadata = {
  metadataBase: new URL(APP_URL),
  title: {
    default: 'AI Event Planner for Weddings & Events | Eventwise AI',
    template: '%s | Eventwise AI',
  },
  description:
    'Plan weddings, birthdays, and community events with AI-powered budgets, timelines, vendor checklists, and personalized ideas—all in one place.',
  keywords: [
    'AI event planner',
    'wedding planner',
    'birthday party planner',
    'event budget planner',
    'event planning checklist',
    'vendor management',
    'event management software',
  ],
  authors: [{ name: 'Eventwise AI' }],
  creator: 'Eventwise AI',
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: APP_URL,
    siteName: 'Eventwise AI',
    title: 'AI Event Planner for Weddings & Events | Eventwise AI',
    description:
      'Plan weddings, birthdays, and community events with AI-powered budgets, timelines, vendor checklists, and personalized ideas—all in one place.',
    images: [
      {
        url: OG_IMAGE,
        width: 1200,
        height: 630,
        alt: 'Eventwise AI — AI-powered event planning dashboard',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Event Planner for Weddings & Events | Eventwise AI',
    description:
      'Plan weddings, birthdays, and community events with AI-powered budgets, timelines, and vendor checklists.',
    images: [OG_IMAGE],
  },
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: '/apple-touch-icon.png',
  },
};

const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Eventwise AI',
  url: APP_URL,
  logo: `${APP_URL}/favicon.svg`,
  description:
    'AI-powered event planning platform for weddings, birthdays, community gatherings, and corporate events.',
};

const softwareJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'Eventwise AI',
  applicationCategory: 'BusinessApplication',
  operatingSystem: 'Web',
  url: APP_URL,
  description:
    'Plan weddings, birthdays, and community events with AI-powered budgets, timelines, vendor checklists, and personalized ideas.',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'INR',
    description: 'Free plan available. Pro and Agency plans offered.',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`h-full ${GeistSans.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareJsonLd) }}
        />
      </head>
      <body className="h-full font-sans antialiased text-foreground bg-background selection:bg-brand-100 selection:text-brand-900">
        {children}
      </body>
    </html>
  );
}

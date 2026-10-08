import type { Metadata } from 'next';
import Link from 'next/link';
import { SiteHeader } from '@/components/site-header';
import './globals.css';
import { siteUrl } from './site-url';
export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  icons: { icon: '/icon.svg' },
  title: {
    default: 'Hue & Hair — discover your kind of beautiful',
    template: '%s | Hue & Hair',
  },
  description:
    'Explore women’s hairstyles and personal colour palettes for everyone. Considered inspiration, practical guides and a gentle place to start.',
  openGraph: {
    type: 'website',
    siteName: 'Hue & Hair',
    images: [
      {
        url: '/images/editorial/hero.webp',
        width: 1536,
        height: 1024,
        alt: 'Editorial hairstyle inspiration',
      },
    ],
  },
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en-GB">
      <body>
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        <SiteHeader />
        <main id="main" tabIndex={-1}>
          {children}
        </main>
        <footer className="site-footer">
          <div className="footer-top">
            <Link className="wordmark" href="/">
              hue <span>&</span> hair.
            </Link>
            <p>
              Inspiration for your hair.
              <br />A fresh perspective on your colours.
            </p>
            <nav aria-label="Footer navigation">
              <Link href="/about/">About</Link>
              <Link href="/privacy/">Privacy</Link>
              <Link href="/accessibility/">Accessibility</Link>
            </nav>
          </div>
          <div className="footer-bottom">
            <span>Made for curiosity. Made for everyone.</span>
            <p>
              Images are AI-generated illustrations. Colour analysis is personal
              styling guidance, not a diagnosis.
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}

'use client';
import Link from 'next/link';
import { useRef } from 'react';
import { usePathname } from 'next/navigation';

const links = [
  { href: '/hairstyles/', label: 'Hairstyles' },
  { href: '/colour-analysis/', label: 'Colour analysis' },
  { href: '/self-assessment/', label: 'Find your palette' },
  { href: '/about/', label: 'Our approach' },
];
export function SiteHeader() {
  const opener = useRef<HTMLButtonElement>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const pathname = usePathname();
  const current = (href: string) =>
    pathname === href.replace(/\/$/, '') || pathname.startsWith(href);
  return (
    <header className="site-header">
      <div className="header-inner">
        <Link
          className="wordmark"
          href="/"
          aria-label="Hue and Hair home"
          aria-current={pathname === '/' ? 'page' : undefined}
        >
          hue <span>&</span> hair<span className="brand-dot">.</span>
        </Link>
        <nav aria-label="Main navigation" className="desktop-nav">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              aria-current={current(l.href) ? 'page' : undefined}
            >
              {l.label}
            </Link>
          ))}
        </nav>
        <button
          ref={opener}
          className="menu-button"
          onClick={() => dialog.current?.showModal()}
          aria-haspopup="dialog"
        >
          Menu <span aria-hidden="true">☰</span>
        </button>
      </div>
      <noscript>
        <style>{'.menu-button{display:none!important}'}</style>
        <nav
          aria-label="Navigation without JavaScript"
          className="no-script-nav"
        >
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              aria-current={current(l.href) ? 'page' : undefined}
            >
              {l.label}
            </Link>
          ))}
        </nav>
      </noscript>
      <dialog
        ref={dialog}
        className="mobile-dialog"
        aria-labelledby="menu-title"
        onClose={() => opener.current?.focus()}
        onKeyDown={(event) => {
          if (event.key !== 'Tab') return;
          const controls =
            event.currentTarget.querySelectorAll<HTMLElement>(
              'button, a[href]',
            );
          event.preventDefault();
          const index = Array.from(controls).indexOf(document.activeElement as HTMLElement);
          const next = (index + (event.shiftKey ? -1 : 1) + controls.length) % controls.length;
          controls[next]?.focus();
        }}
      >
        <div className="dialog-head">
          <h2 id="menu-title">Explore</h2>
          <button
            className="button secondary"
            onClick={() => dialog.current?.close()}
          >
            Close
          </button>
        </div>
        <nav aria-label="Mobile navigation">
          {links.map((l) => (
            <Link
              onClick={() => dialog.current?.close()}
              key={l.href}
              href={l.href}
              aria-current={current(l.href) ? 'page' : undefined}
            >
              {l.label}
              <span aria-hidden="true">↗</span>
            </Link>
          ))}
        </nav>
      </dialog>
    </header>
  );
}

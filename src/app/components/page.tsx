import Link from 'next/link';
import { getPalettes, getHairstyles } from '@/lib/content';
import { PaletteCard } from '@/components/palette-card';
import { HairstyleCard } from '@/components/hairstyle-card';
export const metadata = {
  alternates: { canonical: '/components/' },
  title: 'Component showcase',
  robots: { index: false, follow: false },
};
export default function Components() {
  return (
    <section className="shell section">
      <p className="eyebrow">Design system</p>
      <h1>Considered details.</h1>
      <p className="lead">
        Editorial typography, generous spacing and clear interactive controls.
      </p>
      <h2>Actions</h2>
      <div className="actions">
        <Link className="button" href="/hairstyles/">
          Primary link ↗
        </Link>
        <button className="button secondary" type="button" disabled>
          Disabled button
        </button>
        <Link className="text-link" href="/colour-analysis/">
          Text link →
        </Link>
      </div>
      <h2>Content cards</h2>
      <div className="card-grid">
        <HairstyleCard item={getHairstyles()[0]} />
        <PaletteCard palette={getPalettes()[0]} />
      </div>
      <h2>Information banner</h2>
      <div className="info-banner">
        <p>
          Clear supporting information, presented without relying on colour
          alone.
        </p>
      </div>
      <h2>Disclosure</h2>
      <details className="methodology">
        <summary>Read supporting guidance</summary>
        <p>
          Native disclosure controls work with keyboard navigation and without
          JavaScript.
        </p>
      </details>
    </section>
  );
}

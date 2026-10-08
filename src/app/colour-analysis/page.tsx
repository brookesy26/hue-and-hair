import Link from 'next/link';
import { getPalettes, getComparisons } from '@/lib/content';
import { PaletteCard } from '@/components/palette-card';
import { Media } from '@/components/media';
export const metadata = {
  alternates: { canonical: '/colour-analysis/' },
  title: 'Personal colour analysis for everyone',
  description:
    'Explore twelve seasonal palettes through warmth, depth and clarity. Inclusive colour guidance without rigid rules.',
};
export default function Colour() {
  return (
    <>
      <section className="shell section">
        <div className="page-heading">
          <p className="eyebrow">Personal colour analysis · for everyone</p>
          <h1>
            Find colours that feel
            <br />
            <em>like you.</em>
          </h1>
          <p className="lead">
            A little understanding can open up a lot of possibilities. Explore
            how temperature, depth and clarity change a palette — and try the
            colours that catch your eye.
          </p>
        </div>
        <div className="info-banner">
          <p>
            Seasonal colour analysis is a styling framework, not a scientific
            diagnosis. You can enjoy any colour, whatever your palette, gender
            or background.
          </p>
          <Link className="button" href="/self-assessment/">
            Try the self-assessment ↗
          </Link>
        </div>
        <div className="section-heading">
          <div>
            <p className="eyebrow">Three ways to look at colour</p>
            <h2>The starting points</h2>
          </div>
        </div>
        <div className="three-columns concepts">
          <div>
            <h3>Temperature</h3>
            <p>
              Warm palettes tend towards golden and earthy tones; cool palettes
              towards blue-based and rosy tones. Compare fabrics in consistent
              daylight.
            </p>
          </div>
          <div>
            <h3>Depth</h3>
            <p>
              Light, medium and deep describe the darkness of colours. Try a few
              depths close to your face and notice which combinations you enjoy.
            </p>
          </div>
          <div>
            <h3>Clarity</h3>
            <p>
              Soft colours have a muted quality. Bright colours feel more
              saturated. Balanced colours sit between the two.
            </p>
          </div>
        </div>
        <div className="section-heading">
          <div>
            <p className="eyebrow">Twelve invitations to experiment</p>
            <h2>Meet the palettes</h2>
          </div>
          <p>
            A season gives a collection its name. It does not tell you what you
            must wear.
          </p>
        </div>
        <div className="palette-grid">
          {getPalettes().map((p) => (
            <PaletteCard key={p.slug} palette={p} />
          ))}
        </div>
      </section>
      <section className="shell section">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Look, compare, experiment</p>
            <h2>Colour in context</h2>
          </div>
          <p>
            These illustrations show colour relationships. They are not evidence
            for assigning anyone a season; generated skin and lighting can be
            inconsistent.
          </p>
        </div>
        <div className="comparison-grid">
          {getComparisons().map((comparison) => (
            <Media
              key={comparison.id}
              src={comparison.src}
              alt={comparison.alt}
              caption={comparison.caption}
            />
          ))}
        </div>
      </section>
    </>
  );
}

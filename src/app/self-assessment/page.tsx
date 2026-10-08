import { Assessment } from '@/components/assessment';
import Link from 'next/link';
export const metadata = {
  alternates: { canonical: '/self-assessment/' },
  title: 'Explore your colour palette',
  description:
    'A short, inclusive self-assessment to explore tentative colour palette suggestions.',
};
export default function AssessmentPage() {
  return (
    <section className="shell section">
      <div className="page-heading compact">
        <p className="eyebrow">A gentle place to start</p>
        <h1>
          Let’s explore
          <br />
          <em>your colours.</em>
        </h1>
        <p className="lead">
          Three questions to help you explore colour preferences. Compare real
          fabrics in consistent daylight if you can. No uploads, no accounts, no
          definitive labels.
        </p>
      </div>
      <Assessment />
      <noscript>
        <div className="info-banner">
          <p>
            The self-assessment needs JavaScript. You can still explore all
            twelve palettes from the colour analysis page.
          </p>
          <Link className="button" href="/colour-analysis/">
            Browse palettes
          </Link>
        </div>
      </noscript>
      <details className="methodology">
        <summary>How the suggestions work</summary>
        <p>
          Your answers describe temperature, depth and clarity. Each matching
          characteristic earns one point when compared with the twelve palettes.
          All three characteristics have equal weight. We suggest up to three
          palettes with the highest score, provided at least two characteristics
          match. “Unsure” adds no preference. Fewer than two known answers, or
          more than three tied best matches, produce an open result instead of a
          definitive season.
        </p>
      </details>
    </section>
  );
}

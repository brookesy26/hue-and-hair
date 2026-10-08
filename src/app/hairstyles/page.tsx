import { Suspense } from 'react';
import { Gallery } from '@/components/gallery';
import { HairstyleCard } from '@/components/hairstyle-card';
import { getHairstyles } from '@/lib/content';
import { Media } from '@/components/media';
export const metadata = {
  alternates: { canonical: '/hairstyles/' },
  title: 'Explore women’s hairstyles',
  description:
    '30 hairstyles across straight, wavy, curly and coily textures, with practical styling and maintenance guides.',
};
export default function Hairstyles() {
  return (
    <section className="shell section">
      <div className="gallery-heading">
        <div className="page-heading">
          <p className="eyebrow">Find a fresh perspective</p>
          <h1>
            Your hair.
            <br />
            <em>Your possibilities.</em>
          </h1>
          <p className="lead">
            Thirty styles, endless ways to make them your own. Explore women’s
            hairstyles by length, texture and the time you want to spend
            styling.
          </p>
        </div>
        <Media
          src="/images/editorial/hairstyles.webp"
          alt="An adult woman with medium-brown skin touching her shoulder-length curls"
        />
      </div>
      <h2 className="sr-only">The hairstyle collection</h2>
      <Suspense
        fallback={
          <>
            <p className="results-count">
              30 hairstyles to explore. Interactive filtering requires
              JavaScript.
            </p>
            <div className="card-grid">
              {getHairstyles().map((h) => (
                <HairstyleCard item={h} key={h.slug} />
              ))}
            </div>
          </>
        }
      >
        <Gallery />
      </Suspense>
    </section>
  );
}

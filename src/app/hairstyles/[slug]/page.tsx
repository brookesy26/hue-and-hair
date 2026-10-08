import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getHairstyles, getHairstyle } from '@/lib/content';
import { Media } from '@/components/media';
export function generateStaticParams() {
  return getHairstyles().map((h) => ({ slug: h.slug }));
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const h = getHairstyle((await params).slug);
  return {
    alternates: { canonical: `/hairstyles/${h?.slug ?? ''}/` },
    title: h?.name ?? 'Hairstyle not found',
    description: h?.summary,
  };
}
export default async function Hairstyle({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const h = getHairstyle((await params).slug);
  if (!h) notFound();
  return (
    <article className="shell section">
      <Link className="text-link back-link" href="/hairstyles/">
        ← All hairstyles
      </Link>
      <div className="detail-heading">
        <p className="eyebrow">
          {h.length} · {h.texture} · {h.maintenance} upkeep
        </p>
        <h1>{h.name}</h1>
        <p className="lead">{h.summary}</p>
      </div>
      <div className="image-pair">
        {h.images.map((i) => (
          <Media key={i.src} src={i.src} alt={i.alt} />
        ))}
      </div>
      <div className="detail-body">
        <div>
          <p className="eyebrow">The feeling</p>
          <h2>A closer look</h2>
          <p className="lead">{h.description}</p>
          <p className="small-note">
            These generated images are inspiration. A hairdresser can help adapt
            the shape to your density, growth patterns and preferred routine.
          </p>
        </div>
        <div>
          <h2>Make it work for you</h2>
          <h3>Styling notes</h3>
          <ul>
            {h.styling.map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>
          <h3>Everyday upkeep</h3>
          <ul>
            {h.upkeep.map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>
        </div>
      </div>
      <aside className="salon-note">
        <p className="eyebrow">Take it to your next appointment</p>
        <h2>A conversation starter</h2>
        <blockquote>“{h.salonRequest}”</blockquote>
        <p>
          Bring a reference and talk through what is realistic for your hair,
          your time and your budget.
        </p>
      </aside>
    </article>
  );
}

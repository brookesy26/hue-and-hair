import Link from 'next/link';
import { Media } from './media';
import { getHairstyles } from '@/lib/content';
type Hairstyle = ReturnType<typeof getHairstyles>[number];
export function HairstyleCard({ item }: { item: Hairstyle }) {
  return (
    <article className="style-card">
      <Link
        className="card-image-link"
        href={`/hairstyles/${item.slug}/`}
        aria-label={`Explore ${item.name}`}
      >
        <Media src={item.images[0].src} alt={item.images[0].alt} />
        <span className="image-arrow" aria-hidden="true">
          ↗
        </span>
      </Link>
      <div className="card-meta">
        {item.length} · {item.texture} · {item.maintenance} upkeep
      </div>
      <h3>
        <Link href={`/hairstyles/${item.slug}/`}>{item.name}</Link>
      </h3>
      <p>{item.summary}</p>
    </article>
  );
}

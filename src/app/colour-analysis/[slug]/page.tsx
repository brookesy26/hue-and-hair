import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getPalettes, getPalette } from '@/lib/content';
export function generateStaticParams() {
  return getPalettes().map((p) => ({ slug: p.slug }));
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const p = getPalette((await params).slug);
  return {
    alternates: { canonical: `/colour-analysis/${p?.slug ?? ''}/` },
    title: p?.name ?? 'Palette not found',
    description: p?.summary,
  };
}
export default async function Palette({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const p = getPalette((await params).slug);
  if (!p) notFound();
  return (
    <article className="shell section">
      <Link className="text-link back-link" href="/colour-analysis/">
        ← All palettes
      </Link>
      <div className="detail-heading">
        <p className="eyebrow">
          {p.temperature} · {p.depth} · {p.chroma}
        </p>
        <h1>{p.name}</h1>
        <p className="lead">{p.summary}</p>
      </div>
      <div className="swatch-grid">
        {p.colours.map((c) => (
          <div className="swatch" key={c.hex}>
            <div style={{ background: c.hex }} aria-hidden="true" />
            <h2>{c.name}</h2>
            <p>{c.hex}</p>
          </div>
        ))}
      </div>
      <div className="detail-body">
        <div>
          <p className="eyebrow">A palette, not a prescription</p>
          <h2>The character</h2>
          <p className="lead">{p.description}</p>
          <p>
            Screen settings and fabric texture change how colours look. Use
            these swatches as starting points and compare real fabrics in
            consistent natural light.
          </p>
        </div>
        <div>
          <h2>Put it into practice</h2>
          <h3>Clothing combinations</h3>
          <ul>
            {p.outfits.map((o) => (
              <li key={o}>{o}</li>
            ))}
          </ul>
          <h3>Other directions to explore</h3>
          <ul>
            {p.explore.map((e) => (
              <li key={e}>
                <Link href={`/colour-analysis/${e}/`}>
                  {getPalette(e)?.name ?? e}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="info-banner">
        <p>
          There is no wrong season to enjoy. Your taste, context and comfort
          matter more than a category.
        </p>
        <Link className="button" href="/self-assessment/">
          Explore your preferences ↗
        </Link>
      </div>
    </article>
  );
}

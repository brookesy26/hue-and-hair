import Link from 'next/link';
import { getPalettes } from '@/lib/content';
type Palette = ReturnType<typeof getPalettes>[number];
export function PaletteCard({ palette: p }: { palette: Palette }) {
  return (
    <article className="palette-card">
      <Link href={`/colour-analysis/${p.slug}/`}>
        <div className="palette-strip" aria-hidden="true">
          {p.colours.slice(0, 5).map((c) => (
            <span style={{ background: c.hex }} key={c.hex} />
          ))}
        </div>
        <p className="eyebrow">
          {p.temperature} · {p.depth} · {p.chroma}
        </p>
        <h3>
          {p.name}
          <span aria-hidden="true">↗</span>
        </h3>
      </Link>
      <p>{p.summary}</p>
    </article>
  );
}

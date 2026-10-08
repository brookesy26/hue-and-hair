'use client';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { getHairstyles } from '@/lib/content';
import { HairstyleCard } from './hairstyle-card';
const dimensions = ['length', 'texture', 'style', 'maintenance'] as const;
export function Gallery() {
  const all = getHairstyles();
  const params = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const selected = Object.fromEntries(
    dimensions.map((d) => [
      d,
      all.some((h) => h[d] === params.get(d)) ? params.get(d)! : '',
    ]),
  );
  const results = all.filter((h) =>
    dimensions.every((d) => !selected[d] || h[d] === selected[d]),
  );
  function update(key: string, value: string) {
    const next = new URLSearchParams(params.toString());
    if (value) next.set(key, value);
    else next.delete(key);
    router.replace(`${pathname}${next.size ? '?' + next.toString() : ''}`, {
      scroll: false,
    });
  }
  return (
    <>
      <div className="filter-bar">
        {dimensions.map((d) => (
          <label key={d}>
            {d === 'maintenance'
              ? 'Upkeep'
              : d.charAt(0).toUpperCase() + d.slice(1)}
            <select
              value={selected[d]}
              onChange={(e) => update(d, e.target.value)}
            >
              <option value="">
                All {d === 'maintenance' ? 'upkeep levels' : d + 's'}
              </option>
              {[...new Set(all.map((h) => h[d]))].map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </select>
          </label>
        ))}
        <button
          className="text-link reset-button"
          onClick={() => router.replace(pathname, { scroll: false })}
        >
          Clear filters
        </button>
      </div>
      <p className="results-count" role="status">
        {results.length} {results.length === 1 ? 'hairstyle' : 'hairstyles'} to
        explore
      </p>
      {results.length ? (
        <div className="card-grid">
          {results.map((h) => (
            <HairstyleCard key={h.slug} item={h} />
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <h2>A different combination?</h2>
          <p>
            No styles match these filters. Try widening your search or clearing
            the filters.
          </p>
        </div>
      )}
      <noscript>
        <p>
          Interactive filters require JavaScript. Browse the full collection
          below.
        </p>
      </noscript>
    </>
  );
}

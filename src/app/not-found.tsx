import Link from 'next/link';
export default function NotFound() {
  return (
    <section className="shell section empty-state">
      <p className="eyebrow">404 · A little off the beaten path</p>
      <h1>
        Let’s find your
        <br />
        <em>way back.</em>
      </h1>
      <p>The page you are looking for could not be found.</p>
      <div className="actions">
        <Link className="button" href="/">
          Return home
        </Link>
        <Link className="text-link" href="/hairstyles/">
          Explore hairstyles →
        </Link>
      </div>
    </section>
  );
}

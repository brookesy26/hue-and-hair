export const metadata = { alternates: { canonical: '/' } };
import Link from 'next/link';
import { Media } from '@/components/media';
import { HairstyleCard } from '@/components/hairstyle-card';
import { getHairstyles } from '@/lib/content';
export default function Home() {
  const styles = getHairstyles();
  return (
    <>
      <section className="hero shell">
        <div className="hero-copy">
          <p className="eyebrow">Your next chapter, beautifully considered</p>
          <h1>
            A little inspiration.
            <br />A little more <em>you.</em>
          </h1>
          <p className="lead">
            A haircut that feels right. Colours that make you feel good.
            Discover possibilities, with thoughtful guides to help you make them
            your own.
          </p>
          <div className="actions">
            <Link className="button" href="/hairstyles/">
              Explore hairstyles <span aria-hidden="true">↗</span>
            </Link>
            <Link className="text-link" href="/colour-analysis/">
              Discover your colours <span aria-hidden="true">→</span>
            </Link>
          </div>
          <div className="hero-note">
            <span className="tiny-swatch" />
            <p>
              Less about rules.
              <br />
              More about what feels like you.
            </p>
          </div>
        </div>
        <div className="hero-art">
          <Media
            src="/images/editorial/hero.webp"
            priority
            alt="Three adults with silver pixie, curly and short hairstyles, seated with fabric drapes"
          />
          <span className="image-sticker">
            Find your
            <br />
            <em>beautiful.</em>
          </span>
        </div>
      </section>
      <div className="ribbon">
        <span>Every texture</span>
        <span aria-hidden="true">✦</span>
        <span>Every shade</span>
        <span aria-hidden="true">✦</span>
        <span>Your own expression</span>
        <span aria-hidden="true">✦</span>
        <span>A fresh perspective</span>
      </div>
      <section className="shell section">
        <div className="section-heading">
          <div>
            <p className="eyebrow">A change starts with a little curiosity</p>
            <h2>
              Good hair days,
              <br />
              <em>your way.</em>
            </h2>
          </div>
          <div>
            <p>
              From a confident crop to flowing layers, find a style that works
              with your texture and everyday rhythm.
            </p>
            <Link className="text-link" href="/hairstyles/">
              See all 30 hairstyles <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
        <div className="card-grid featured">
          {[styles[0], styles[10], styles[20]].filter(Boolean).map((s) => (
            <HairstyleCard item={s} key={s.slug} />
          ))}
        </div>
      </section>
      <section className="colour-feature">
        <div className="shell feature-grid">
          <Media
            src="/images/editorial/colour.webp"
            alt="A masculine-presenting adult with medium-brown skin and short curls wearing a terracotta drape"
          />
          <div className="feature-copy">
            <p className="eyebrow">Personal colour analysis · for everyone</p>
            <h2>
              A world of colour.
              <br />
              <em>Your place in it.</em>
            </h2>
            <p className="lead">
              Explore warm and cool tones, softer shades and bright contrasts. A
              palette is a starting point for experimenting, never a limit on
              what you can wear.
            </p>
            <div className="palette-decoration" aria-hidden="true">
              {['#613d4b', '#b57865', '#d2ad83', '#66745e', '#404c60'].map(
                (c) => (
                  <span key={c} style={{ background: c }} />
                ),
              )}
            </div>
            <Link className="button" href="/colour-analysis/">
              Meet the 12 palettes <span aria-hidden="true">↗</span>
            </Link>
          </div>
        </div>
      </section>
      <section className="shell section approach">
        <p className="eyebrow">Inspiration, with room to be yourself</p>
        <h2>
          Style is personal.
          <br />
          The possibilities are <em>open.</em>
        </h2>
        <div className="three-columns">
          <div>
            <span className="step-number">01</span>
            <h3>Explore without pressure</h3>
            <p>
              Take what inspires you and leave the rest. Your preferences always
              have the final say.
            </p>
          </div>
          <div>
            <span className="step-number">02</span>
            <h3>Make it practical</h3>
            <p>
              Find styling tips, realistic upkeep and useful words for your next
              salon conversation.
            </p>
          </div>
          <div>
            <span className="step-number">03</span>
            <h3>Keep it curious</h3>
            <p>
              Use colour suggestions as an experiment. Lighting, texture and
              personal taste all matter.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}

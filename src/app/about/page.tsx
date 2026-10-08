import { Media } from '@/components/media';
export const metadata = {
  alternates: { canonical: '/about/' },
  title: 'Our approach',
};
export default function About() {
  return (
    <section className="shell section">
      <div className="page-heading">
        <p className="eyebrow">A considered approach to personal style</p>
        <h1>
          More possibilities.
          <br />
          <em>Less pressure.</em>
        </h1>
      </div>
      <div className="feature-grid">
        <Media
          src="/images/editorial/about.webp"
          alt="A still life of fabric swatches, scissors and a comb"
        />
        <div className="prose">
          <h2>Welcome to Hue & Hair</h2>
          <p>
            We bring together hairstyle inspiration and colour guidance to make
            exploring your personal style feel a little easier.
          </p>
          <p>
            Our hairstyle collection currently focuses on women’s styles, with
            straight, wavy, curly and coily textures represented. Our colour
            guidance is for everyone, regardless of gender or background.
          </p>
          <h2>Inspiration with perspective</h2>
          <p>
            The guide photographs on this website are AI-generated
            illustrations. They help show ideas, but do not promise an exact
            salon outcome or establish a person’s colour season.
          </p>
          <p>
            Seasonal colour analysis is a styling framework. Lighting,
            materials, preferences and the limitations of screens all affect how
            we see colour. We encourage experimentation rather than rigid
            labels.
          </p>
          <h2>Practical, personal choices</h2>
          <p>
            Use our hairstyle guides to start a conversation with your
            hairdresser. Use our palettes to try new combinations. Keep the
            things you enjoy and leave the rest.
          </p>
        </div>
      </div>
    </section>
  );
}

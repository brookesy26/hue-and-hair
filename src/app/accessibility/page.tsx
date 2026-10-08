export const metadata = {
  alternates: { canonical: '/accessibility/' },
  title: 'Accessibility',
};
export default function Accessibility() {
  return (
    <article className="shell section prose narrow">
      <p className="eyebrow">Access for everyone</p>
      <h1>Accessibility</h1>
      <p className="lead">
        We aim to make Hue & Hair clear, usable and comfortable to explore.
      </p>
      <h2>Using the website</h2>
      <p>
        You can navigate with a keyboard, skip to the main content, and enlarge
        text using your browser. The mobile menu supports Escape to close.
        Colour swatches include their names and hexadecimal values, so colour is
        not the only way information is communicated.
      </p>
      <p>
        Our pages respect reduced-motion preferences. The self-assessment
        includes an “unsure” choice and lets you review previous answers.
      </p>
      <h2>JavaScript and images</h2>
      <p>
        Guides and palette pages are readable without JavaScript. Gallery
        filtering and the self-assessment require JavaScript. Image descriptions
        provide context; generated visual examples cannot fully reproduce real
        hair texture or colour appearance.
      </p>
      <h2>Verification and limitations</h2>
      <p>
        We use automated checks and manual browser review during development.
        These checks do not establish complete WCAG conformance. WCAG 2.2 AAA is
        an assessment target, and we do not claim that every criterion has been
        verified.
      </p>
      <p>
        Manual review with assistive technology and individual user needs may
        identify further improvements. Technical verification evidence and
        outstanding limitations are recorded in the project’s accessibility
        documentation.
      </p>
    </article>
  );
}

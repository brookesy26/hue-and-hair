export const metadata = {
  alternates: { canonical: '/privacy/' },
  title: 'Privacy',
};
export default function Privacy() {
  return (
    <article className="shell section prose narrow">
      <p className="eyebrow">Your privacy</p>
      <h1>Simply explore.</h1>
      <p className="lead">
        Hue & Hair does not ask you to create an account, upload photographs or
        provide personal details.
      </p>
      <h2>Your self-assessment answers</h2>
      <p>
        Answers are held in the page’s memory while you use the self-assessment.
        They are not sent to us, saved in browser storage or retained when you
        refresh or close the page.
      </p>
      <h2>Cookies and analytics</h2>
      <p>
        We do not add analytics, advertising trackers or site cookies. Hairstyle
        filters appear in the page URL, so a shared filtered link contains your
        filter selections.
      </p>
      <h2>Website hosting</h2>
      <p>
        The website is hosted by Cloudflare Pages. The hosting provider may
        process technical request information, such as an IP address, to deliver
        and protect the site. See{' '}
        <a href="https://www.cloudflare.com/privacypolicy/">
          Cloudflare’s privacy policy
        </a>{' '}
        for its practices.
      </p>
      <h2>External links</h2>
      <p>
        External websites have their own privacy policies. Follow an external
        link only if you want to visit that service.
      </p>
      <p className="small-note">Last reviewed: 8 October 2026.</p>
    </article>
  );
}

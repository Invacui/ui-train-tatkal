import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ROUTES } from '@/constants/routes';

export default function Landing() {
  return (
    <>
      <Helmet>
        <title>LeadFlow — AI-Powered Lead Engagement</title>
        <meta name="description" content="Upload leads, build templates, run AI campaigns." />
        <meta property="og:image" content="/og-image.png" />
      </Helmet>

      <section className="mx-auto max-w-6xl px-4 py-24 text-center">
        <h1 className="text-5xl font-bold tracking-tight">
          AI-Powered Lead Engagement
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
          Upload your lead lists, craft personalized templates, and launch AI-driven campaigns
          that convert.
        </p>
        <div className="mt-8 flex items-center justify-center gap-4">
          <Button size="lg" asChild>
            <Link to={ROUTES.signup}>Get started free</Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link to={ROUTES.pricing}>See pricing</Link>
          </Button>
        </div>
      </section>
    </>
  );
}

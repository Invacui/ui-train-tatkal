import { Helmet } from 'react-helmet-async';

export default function About() {
  return (
    <>
      <Helmet>
        <title>About — LeadFlow</title>
        <meta name="description" content="Learn about the LeadFlow team and mission." />
      </Helmet>

      <div className="mx-auto max-w-3xl px-4 py-16">
        <h1 className="text-4xl font-bold tracking-tight">About LeadFlow</h1>
        <p className="mt-6 text-lg text-muted-foreground">
          LeadFlow is an AI-powered lead engagement platform that helps sales teams automate
          personalised outreach at scale. Upload your lead lists, build templates with dynamic
          variables, and let our AI handle the rest.
        </p>
      </div>
    </>
  );
}

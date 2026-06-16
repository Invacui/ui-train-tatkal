import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { ROUTES } from '@/constants/routes';

const plans = [
  { name: 'Starter', price: '$29', tokens: '5,000', description: 'Perfect for small teams.' },
  { name: 'Growth', price: '$99', tokens: '25,000', description: 'Scale your outreach.' },
  { name: 'Pro', price: '$299', tokens: '100,000', description: 'For high-volume campaigns.' },
];

export default function Pricing() {
  return (
    <>
      <Helmet>
        <title>Pricing — LeadFlow</title>
        <meta name="description" content="Simple, transparent pricing for every team size." />
      </Helmet>

      <div className="mx-auto max-w-6xl px-4 py-16">
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold tracking-tight md:text-5xl">Simple pricing for every stage</h1>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">Start small and scale as your campaigns grow. Transparent token-based pricing.</p>
        </div>

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
          {plans.map((plan) => (
            <Card key={plan.name} className="flex flex-col border-2 transition hover:-translate-y-1 hover:border-primary/60">
              <CardHeader>
                <CardTitle>{plan.name}</CardTitle>
                <CardDescription>{plan.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-1 flex-col justify-between gap-6">
                <div>
                  <p className="text-3xl font-bold">{plan.price}</p>
                  <p className="text-sm text-muted-foreground">{plan.tokens} tokens included</p>
                </div>
                <Button asChild>
                  <Link to={ROUTES.signup}>Get started</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </>
  );
}

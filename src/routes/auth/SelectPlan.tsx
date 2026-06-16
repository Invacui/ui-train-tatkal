import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ROUTES } from '@/constants/routes';
import { toast } from 'sonner';

const plans = [
  { name: 'Starter', price: '$29', tokens: '5,000' },
  { name: 'Growth', price: '$99', tokens: '25,000' },
  { name: 'Pro', price: '$299', tokens: '100,000' },
];

export default function SelectPlan() {
  const navigate = useNavigate();

  const handleChoose = (planName: string) => {
    // @Todo Connect this action to plan subscription API/SDK once keys are available.
    toast.success(`${planName} selected`);
    navigate(ROUTES.dashboard);
  };

  return (
    <>
      <Helmet><title>Select plan — LeadFlow</title></Helmet>
      <div className="mx-auto w-full max-w-4xl px-4 py-10">
        <h1 className="mb-2 text-center text-2xl font-bold">Choose your plan</h1>
        <p className="mb-8 text-center text-muted-foreground">Select a plan to continue onboarding</p>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {plans.map((plan) => (
            <Card key={plan.name}>
              <CardHeader>
                <CardTitle>{plan.name}</CardTitle>
                <CardDescription>{plan.tokens} tokens included</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-2xl font-semibold">{plan.price}</p>
                <Button className="w-full" onClick={() => handleChoose(plan.name)}>Select</Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </>
  );
}

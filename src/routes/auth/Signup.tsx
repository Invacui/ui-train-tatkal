import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSignup } from "@/hooks/auth/useSignup";
import { validationRules, type SignupFormValues } from "@/lib/validationRules";
import { ROUTES } from "@/constants/routes";
import { GoogleAuthButton } from "@/components/auth/GoogleAuthButton";

export default function Signup() {
  const { mutate, isPending } = useSignup();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<SignupFormValues>();

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-xl font-semibold">Create account</h2>
        <p className="text-sm text-muted-foreground">Start your free trial today</p>
      </div>

      <form
        onSubmit={handleSubmit(({ name, email, password, corporationName }) => mutate({ name, email, password, corporationName }))}
        className="flex flex-col gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Name</label>
          <Input placeholder="Jane Smith" {...register("name", validationRules.name)} />
          {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Email</label>
          <Input
            type="email"
            placeholder="you@example.com"
            {...register("email", validationRules.email)}
          />
          {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Corporation Name</label>
        <Input
         type="text"
            placeholder="LeadFlow"
         {...register("corporationName", validationRules.default)}
        />
         {errors.corporationName && <p className="text-sm text-destructive">{errors.corporationName.message}</p>}
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Password</label>
          <Input
            type="password"
            placeholder="At least 8 characters"
            {...register("password", validationRules.password)}
          />
          {errors.password && <p className="text-sm text-destructive">{errors.password.message}</p>}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Confirm password</label>
          <Input
            type="password"
            placeholder="••••••••"
            {...register("confirmPassword", validationRules.confirmPassword(watch))}
          />
          {errors.confirmPassword && (
            <p className="text-sm text-destructive">{errors.confirmPassword.message}</p>
          )}
        </div>

        <Button type="submit" disabled={isPending} className="w-full">
          {isPending ? "Creating account…" : "Create account"}
        </Button>
      </form>

      <div className="relative">
        <div className="absolute inset-0 flex items-center"><span className="w-full border-t" /></div>
        <div className="relative flex justify-center text-xs uppercase"><span className="bg-card px-2 text-muted-foreground">or</span></div>
      </div>
      <GoogleAuthButton redirectTo={ROUTES.selectPlan} />

      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link to={ROUTES.login} className="font-medium text-primary hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  );
}

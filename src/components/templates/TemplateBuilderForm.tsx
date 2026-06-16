import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { validationRules, type CreateTemplateFormValues } from "@/lib/validationRules";
import type { Template } from "@/types/templates.types";
import { cn } from "@/lib/utils";

interface TemplateBuilderFormProps {
  defaultValues?: Partial<Template>;
  onSubmit: (values: CreateTemplateFormValues) => void;
  isPending?: boolean;
  className?: string;
}

export function TemplateBuilderForm({
  defaultValues,
  onSubmit,
  isPending,
  className,
}: TemplateBuilderFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CreateTemplateFormValues>({
    defaultValues: {
      name: defaultValues?.name ?? "",
      subject: defaultValues?.subject ?? "",
      body: defaultValues?.body ?? "",
      channel: defaultValues?.channel ?? "EMAIL",
    },
  });

  const channel = watch("channel");

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={cn("flex flex-col gap-6", className)}>
      <div className="space-y-2">
        <label className="text-sm font-medium">Template name</label>
        <Input
          placeholder="e.g. Cold outreach v1"
          {...register("name", validationRules.templateName)}
        />
        {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Channel</label>
        <Select
          value={channel}
          onValueChange={(v) => setValue("channel", v as "EMAIL" | "WHATSAPP")}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="EMAIL">Email</SelectItem>
            <SelectItem value="WHATSAPP">WhatsApp</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Subject</label>
        <Input
          placeholder="e.g. Quick question about {{company}}"
          {...register("subject", validationRules.subject)}
        />
        {errors.subject && <p className="text-sm text-destructive">{errors.subject.message}</p>}
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Body</label>
        <textarea
          className="flex min-h-[160px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          placeholder="Hi {{firstName}}, I noticed..."
          {...register("body", validationRules.body)}
        />
        {errors.body && <p className="text-sm text-destructive">{errors.body.message}</p>}
      </div>

      <Button type="submit" disabled={isPending}>
        {isPending ? "Saving…" : "Save template"}
      </Button>
    </form>
  );
}

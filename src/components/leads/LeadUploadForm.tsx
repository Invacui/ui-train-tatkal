import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FileDropzone } from "@/components/common/FileDropzone";
import { useUploadLead } from "@/hooks/leads/useUploadLead";
import { validationRules, type UploadLeadFormValues } from "@/lib/validationRules";
import { ROUTES } from "@/constants/routes";
import { cn } from "@/lib/utils";

interface LeadUploadFormProps {
  onSuccess?: (id: string) => void;
  className?: string;
}

export const INDUSTRIES = [
  'EDTECH', 'PHARMACEUTICAL', 'REALESTATE', 'FINTECH', 'HEALTHCARE', 'SAAS',
  'MANUFACTURING', 'RETAIL', 'LOGISTICS', 'HOSPITALITY', 'LEGAL', 'AUTOMOTIVE',
  'TELECOM', 'MEDIA', 'NGO', 'CONSULTING', 'OTHER'
] as const;

export type INDUSTRIES = typeof INDUSTRIES[number];

export function LeadUploadForm({ onSuccess, className }: LeadUploadFormProps) {
  const navigate = useNavigate();
  const { mutate, isPending } = useUploadLead();
  const [file, setFile] = useState<File | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<UploadLeadFormValues>();

  const handleFile = useCallback(
    (f: File) => {
      setFile(f);
      setValue("file", f);
    },
    [setValue]
  );

  /**
   * onSubmit: A callback function that is called when the form is submitted. 
   * 
   * FormData is a constructor function that will create an object that can be used to easily construct a set of key/value pairs 
   * representing form fields and their values, which can then be easily sent using the XMLHttpRequest.send() method or the fetch() API.
   */
  const onSubmit = (values: UploadLeadFormValues) => {
    const fd = new FormData();
    fd.append("listName", values.listName);
    fd.append("industry", values.industry);
    fd.append("description", values.description || "");
    fd.append("file", values.file);
    mutate(fd, {
      onSuccess: (res) => {
        const id = res.data.data.id;
        onSuccess ? onSuccess(id) : navigate(ROUTES.lead(id));
      },
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={cn("flex flex-col gap-6", className)}>
      <div className="space-y-2">
        <label htmlFor="name" className="text-sm font-medium">
          List name
        </label>
        <Input
          id="name"
          placeholder="e.g. Q1 Prospects"
          {...register("listName", validationRules.leadListName)}
        />
        {errors.listName && <p className="text-sm text-destructive">{errors.listName.message}</p>}
      </div>

        <div className="space-y-2">
        <label htmlFor="industry" className="text-sm font-medium">
          Industry
        </label>
        <select
          id="industry"
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          {...register("industry", validationRules.industry)}
        >
          <option value="">Select an industry</option>
          {INDUSTRIES.map((ind) => (
            <option key={ind} value={ind}>
              {ind}
            </option>
          ))}
        </select>
        {errors.industry && <p className="text-sm text-destructive">{errors.industry.message}</p>}
      </div>

      <div className="space-y-2">
        <label htmlFor="description" className="text-sm font-medium">
          Description
        </label>
        <Input
          id="description"
          placeholder="e.g. List of Q1 Prospects"
          {...register("description", validationRules.default)}
        />
        {errors.description && <p className="text-sm text-destructive">{errors.description.message}</p>}
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">File (CSV or XLSX)</label>
        <FileDropzone
          onFile={handleFile}
          file={file}
          accept={{
            "text/csv": [".csv"],
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [".xlsx"],
          }}
        />
        <input type="file" className="hidden" {...register("file", validationRules.file)} />
        {errors.file && <p className="text-sm text-destructive">{errors.file.message as string}</p>}
      </div>

      <Button type="submit" disabled={isPending}>
        {isPending ? "Uploading…" : "Upload leads"}
      </Button>
    </form>
  );
}

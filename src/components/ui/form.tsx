/**
 * @file Shadcn Form component primitives
 * @module components/ui/form
 * @description Provides form field context and components (FormField, FormItem,
 *   FormLabel, FormControl, FormMessage) that integrate react-hook-form
 *   with shadcn styling and validation display.
 */

// React core
import * as React from 'react';

// React Hook Form for form state management
import { useFormContext, Controller } from 'react-hook-form';

// Shadcn Label component
import { Label } from '@/components/ui/label';

// Utility for conditional class names
import { cn } from '@/lib/utils';

type FormFieldContextValue = {
  name: string;
};

const FormFieldContext = React.createContext<FormFieldContextValue>({} as FormFieldContextValue);

/**
 * FormField
 * @description Provides a named form field context and integrates with
 *   react-hook-form's Controller for controlled inputs.
 */
const FormField = ({
  name,
  render,
}: {
  name: string;
  render: (props: { field: object }) => React.ReactElement;
}) => {
  return (
    <FormFieldContext.Provider value={{ name }}>
      <Controller name={name} render={({ field }) => render({ field })} />
    </FormFieldContext.Provider>
  );
};

const useFormField = () => {
  const fieldContext = React.useContext(FormFieldContext);
  const { getFieldState, formState } = useFormContext();
  const fieldState = getFieldState(fieldContext.name, formState);
  return { name: fieldContext.name, ...fieldState };
};

/**
 * FormItem
 * @description Wrapper for a form field's label, control, and message.
 */
const FormItem = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('space-y-2', className)} {...props} />
  ),
);
FormItem.displayName = 'FormItem';

/**
 * FormLabel
 * @description Label for a form field; turns destructive when the field has an error.
 */
const FormLabel = React.forwardRef<
  React.ElementRef<typeof Label>,
  React.ComponentPropsWithoutRef<typeof Label>
>(({ className, ...props }, ref) => {
  const { error } = useFormField();
  return <Label ref={ref} className={cn(error && 'text-destructive', className)} {...props} />;
});
FormLabel.displayName = 'FormLabel';

/**
 * FormControl
 * @description Wrapper for the actual input element within a form item.
 */
const FormControl = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ ...props }, ref) => <div ref={ref} {...props} />,
);
FormControl.displayName = 'FormControl';

/**
 * FormMessage
 * @description Displays validation error message or children as fallback text.
 *   Returns null when no error and no children are provided.
 */
const FormMessage = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, children, ...props }, ref) => {
  const { error } = useFormField();
  const body = error ? String(error.message) : children;
  if (!body) return null;
  return (
    <p
      ref={ref}
      className={cn('text-sm font-medium text-destructive', className)}
      {...props}
    >
      {body}
    </p>
  );
});
FormMessage.displayName = 'FormMessage';

export { FormField, FormItem, FormLabel, FormControl, FormMessage, useFormField };

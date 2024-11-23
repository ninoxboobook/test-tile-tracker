import { useState } from 'react';
import { UseFormReturn, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ZodSchema } from 'zod';
import { toast } from 'react-hot-toast';

interface FormHandlerOptions<T> {
  validationSchema?: ZodSchema;
  onSubmit: (data: T) => Promise<void>;
  onSuccess?: () => void;
  defaultValues?: Partial<T>;
}

export function useFormHandler<T>({
  validationSchema,
  onSubmit,
  onSuccess,
  defaultValues
}: FormHandlerOptions<T>) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<T>({
    resolver: validationSchema ? zodResolver(validationSchema) : undefined,
    defaultValues
  });

  const handleSubmit = async (data: T) => {
    setIsSubmitting(true);
    try {
      await onSubmit(data);
      toast.success('Success!');
      onSuccess?.();
    } catch (error) {
      console.error('Form submission error:', error);
      toast.error('An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    form,
    isSubmitting,
    handleSubmit: form.handleSubmit(handleSubmit)
  };
} 
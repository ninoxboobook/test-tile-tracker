'use client';

import { useFormHandler } from '@/lib/hooks/useFormHandler';
import { TestTileFormData, testTileSchema } from '@/types';
import { useRouter } from 'next/navigation';

export function TestTileForm() {
  const router = useRouter();
  const { form, isSubmitting, handleSubmit } = useFormHandler<TestTileFormData>({
    validationSchema: testTileSchema,
    onSubmit: async (data) => {
      await fetch('/api/test-tiles', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    },
    onSuccess: () => router.push('/test-tiles'),
  });

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        {...form.register('name')}
        placeholder="Test Tile Name"
        className="input input-bordered w-full"
      />
      {form.formState.errors.name && (
        <p className="text-red-500">{form.formState.errors.name.message}</p>
      )}
      
      {/* Add other form fields */}
      
      <button
        type="submit"
        disabled={isSubmitting}
        className="btn btn-primary"
      >
        {isSubmitting ? 'Creating...' : 'Create Test Tile'}
      </button>
    </form>
  );
} 
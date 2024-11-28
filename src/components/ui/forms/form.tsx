interface FormProps {
  children: React.ReactNode;
  onSubmit: (formData: FormData) => Promise<void>;
  className?: string;
}

export function Form({ children, onSubmit, className }: FormProps) {
  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    // Handle multiple select values
    const multiSelects = event.currentTarget.querySelectorAll<HTMLSelectElement>('select[multiple]');
    multiSelects.forEach(select => {
      const name = select.getAttribute('name');
      if (!name) return;
      
      // Remove existing values for this field
      formData.delete(name);
      
      // Add all selected values
      const selectedOptions = Array.from(select.selectedOptions, option => option.value);
      selectedOptions.forEach(value => {
        formData.append(name, value);
      });
    });

    await onSubmit(formData);
  }

  return (
    <form onSubmit={handleSubmit} className={`space-y-6 ${className}`}>
      {children}
    </form>
  );
}
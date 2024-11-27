import Link from "next/link";
import { PageLayout } from "./page-layout";
import { ActionButton } from "../buttons/action-button";

interface FormLayoutProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  backHref: string;
}

export function FormLayout({ title, description, children, backHref }: FormLayoutProps) {
  return (
    <PageLayout
      title={title}
      description={description}
      action={
        <Link href={backHref}>
          <ActionButton variant="secondary">Back</ActionButton>
        </Link>
      }
    >
      <div className="max-w-2xl bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          {children}
        </div>
      </div>
    </PageLayout>
  );
} 
import Link from "next/link";
import { PageLayout } from "./page-layout";
import { ActionButton } from "../buttons/action-button";

interface FormLayoutProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  backHref: string;
  additionalActions?: React.ReactNode;
}

export function FormLayout({ title, description, children, backHref, additionalActions }: FormLayoutProps) {
  return (
    <PageLayout
      title={title}
      description={description}
      action={
        <div className="flex space-x-3 items-center">
          {additionalActions}
          <Link href={backHref}>
            <ActionButton>Back</ActionButton>
          </Link>
        </div>
      }
      variant="detail"
    >
      {children}
    </PageLayout>
  );
} 
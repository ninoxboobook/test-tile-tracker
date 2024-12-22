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
          <ActionButton>Back</ActionButton>
        </Link>
      }
      variant="detail"
    >
      {children}
    </PageLayout>
  );
} 
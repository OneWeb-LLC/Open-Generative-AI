import StandaloneShell from '@/components/StandaloneShell';
import { pageTitle } from '@/lib/ogi/branding';

export const metadata = {
  title: pageTitle('Workflow'),
};

export default function WorkflowPage() {
  return <StandaloneShell />;
}

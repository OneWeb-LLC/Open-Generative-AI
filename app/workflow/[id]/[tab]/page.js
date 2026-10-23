import StandaloneShell from '@/components/StandaloneShell';

import { pageTitle } from '@/lib/ogi/branding';

export const metadata = {
  title: pageTitle('Workflow'),
};

export default function WorkflowTabPage() {
  return <StandaloneShell />;
}

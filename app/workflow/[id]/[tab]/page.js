import StandaloneShell from '@/components/StandaloneShell';
import { getStudioShellProps } from '@/lib/ogi/studio-shell-props.server';

import { pageTitle } from '@/lib/ogi/branding';

export const metadata = {
  title: pageTitle('Workflow'),
};

export default function WorkflowTabPage() {
  return <StandaloneShell {...getStudioShellProps()} />;
}

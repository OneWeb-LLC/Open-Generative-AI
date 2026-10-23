import StandaloneShell from '@/components/StandaloneShell';
import { pageTitle } from '@/lib/ogi/branding';
import { getStudioShellProps } from '@/lib/ogi/studio-shell-props.server';

export const metadata = {
  title: pageTitle('Workflow'),
};

export default function WorkflowPage() {
  return <StandaloneShell {...getStudioShellProps()} />;
}

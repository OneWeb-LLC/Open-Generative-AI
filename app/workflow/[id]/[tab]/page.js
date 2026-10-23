import StandaloneShell from '@/components/StandaloneShell';
import { getStudioShellProps } from '@/lib/ogi/studio-shell-props.server';

export const metadata = {
  title: 'Workflow — Open Generative AI',
};

export default function WorkflowTabPage() {
  return <StandaloneShell {...getStudioShellProps()} />;
}

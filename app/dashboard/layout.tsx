import { checkAuth } from '../auth';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  checkAuth();
  return children;
}
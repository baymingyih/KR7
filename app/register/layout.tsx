import { checkGuest } from '../auth';

export default function RegisterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  checkGuest();
  return children;
}
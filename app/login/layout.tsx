import { checkGuest } from '../auth';

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  checkGuest();
  return children;
}
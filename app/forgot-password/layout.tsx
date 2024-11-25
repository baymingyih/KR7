import { checkGuest } from '../auth';

export default function ForgotPasswordLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  checkGuest();
  return children;
}
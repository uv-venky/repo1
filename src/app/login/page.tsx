import { auth } from 'venky-core/auth';
import { redirect } from 'next/navigation';
import { LoginPageContent } from 'venky-core/ui';

export default async function LoginPage() {
  const session = await auth(true);

  if (session) {
    redirect('/');
    return null;
  }

  return <LoginPageContent />;
}

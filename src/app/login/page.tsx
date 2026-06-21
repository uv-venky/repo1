import { auth } from 'venky-core/auth';
import { redirect } from 'next/navigation';
import { LoginPageContent } from 'venky-core/ui';
import { Repo1LoginLogo } from './repo1-login-logo';
import { REPO1_LOGIN_BACKGROUND_CLASS } from './repo1-login-background';
import { REPO1_LOGIN_TABS } from './repo1-login-tabs';
import { REPO1_LOGIN_LEGAL_NOTICE } from './repo1-login-legal';

export default async function LoginPage() {
  const session = await auth(true);

  if (session) {
    redirect('/');
    return null;
  }

  return (
    <LoginPageContent
      logo={Repo1LoginLogo}
      backgroundClassName={REPO1_LOGIN_BACKGROUND_CLASS}
      tabs={REPO1_LOGIN_TABS}
      legalNotice={REPO1_LOGIN_LEGAL_NOTICE}
    />
  );
}

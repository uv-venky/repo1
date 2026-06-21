import { APP_NAME } from '@/lib/common/ui-constants';
import Link from 'next/link';
import type { ReactNode } from 'react';

export function LegalDocumentPage({
  title,
  lastUpdated,
  children,
}: {
  title: string;
  lastUpdated: string;
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#07070f] text-white">
      <header className="border-white/10 border-b px-6 py-4">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-4">
          <Link href="/login" className="font-semibold text-lg text-white hover:underline">
            {APP_NAME}
          </Link>
          <Link href="/login" className="text-sm text-white/70 hover:text-white hover:underline">
            Back to Sign In
          </Link>
        </div>
      </header>
      <main className="mx-auto max-w-3xl px-6 py-10">
        <h1 className="mb-2 font-semibold text-3xl">{title}</h1>
        <p className="mb-8 text-sm text-white/50">Last updated: {lastUpdated}</p>
        <article className="space-y-6 text-sm text-white/85 leading-relaxed">{children}</article>
      </main>
    </div>
  );
}

function LegalSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section>
      <h2 className="mb-2 font-medium text-base text-white">{title}</h2>
      {children}
    </section>
  );
}

export function TermsPageContent() {
  return (
    <LegalDocumentPage title="Terms and Conditions" lastUpdated="June 20, 2026">
      <p>
        These Terms and Conditions (&quot;Terms&quot;) govern access to and use of the {APP_NAME} administration portal
        (&quot;Service&quot;). By signing in, you agree to these Terms.
      </p>
      <LegalSection title="1. Use of the Service">
        <p>
          {APP_NAME} is provided for authorized administrators and operators. You must use the Service only for lawful
          business purposes related to your organization&apos;s use of {APP_NAME}.
        </p>
      </LegalSection>
      <LegalSection title="2. Accounts and Security">
        <p>
          You are responsible for safeguarding your credentials and for all activity under your account. Notify your
          organization administrator immediately if you suspect unauthorized access.
        </p>
      </LegalSection>
      <LegalSection title="3. Acceptable Use">
        <p>
          You may not attempt to bypass security controls, probe systems without authorization, upload malicious code, or
          use the Service in a way that disrupts other users or underlying infrastructure.
        </p>
      </LegalSection>
      <LegalSection title="4. Intellectual Property">
        <p>
          The Service, including software, branding, and documentation, is owned by the {APP_NAME} provider and its
          licensors. These Terms do not grant ownership of any intellectual property.
        </p>
      </LegalSection>
      <LegalSection title="5. Disclaimer">
        <p>
          The Service is provided on an &quot;as is&quot; basis for demonstration and internal administration purposes.
          Dummy legal text only — replace with counsel-reviewed terms before production use.
        </p>
      </LegalSection>
      <LegalSection title="6. Contact">
        <p>
          Questions about these Terms: <a className="text-[#7c5cff] hover:underline" href="mailto:legal@repo1.local">legal@repo1.local</a>
        </p>
      </LegalSection>
    </LegalDocumentPage>
  );
}

export function PrivacyPageContent() {
  return (
    <LegalDocumentPage title="Data Privacy Notice" lastUpdated="June 20, 2026">
      <p>
        This Data Privacy Notice describes how {APP_NAME} collects, uses, and protects personal information when you use
        the administration portal.
      </p>
      <LegalSection title="1. Information We Collect">
        <ul className="list-disc space-y-1 pl-5">
          <li>Account identifiers such as username, display name, and email address</li>
          <li>Authentication and session data required to keep you signed in securely</li>
          <li>Activity logs related to administrative actions performed in the portal</li>
        </ul>
      </LegalSection>
      <LegalSection title="2. How We Use Information">
        <p>
          We use collected information to authenticate users, operate the Service, maintain audit records, improve
          reliability, and respond to support requests from your organization.
        </p>
      </LegalSection>
      <LegalSection title="3. Sharing">
        <p>
          {APP_NAME} does not sell personal information. Data may be processed by infrastructure providers (for example,
          database hosting) under agreements that require appropriate safeguards.
        </p>
      </LegalSection>
      <LegalSection title="4. Retention">
        <p>
          Account and activity records are retained according to your organization&apos;s configuration and applicable
          policy requirements. Contact your administrator to request account updates or deactivation.
        </p>
      </LegalSection>
      <LegalSection title="5. Security">
        <p>
          We apply industry-standard measures including encrypted transport, access controls, and audit logging. No
          method of transmission or storage is completely secure.
        </p>
      </LegalSection>
      <LegalSection title="6. Your Choices">
        <p>
          You may review and update certain profile information after signing in. For other privacy requests, contact{' '}
          <a className="text-[#7c5cff] hover:underline" href="mailto:privacy@repo1.local">privacy@repo1.local</a>.
        </p>
      </LegalSection>
      <LegalSection title="7. Placeholder Notice">
        <p>
          This is sample privacy content for {APP_NAME} development environments. Replace with organization-specific,
          counsel-reviewed language before production deployment.
        </p>
      </LegalSection>
    </LegalDocumentPage>
  );
}

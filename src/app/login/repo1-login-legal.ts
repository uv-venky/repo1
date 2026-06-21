import type { LoginLegalNoticeConfig } from 'venky-core/ui';

export const REPO1_LOGIN_LEGAL_NOTICE: LoginLegalNoticeConfig = {
  prefix: 'By signing in, I have read and agree to the',
  termsLink: { label: 'Terms and Conditions', href: '/legal/terms' },
  conjunction: 'and',
  privacyLink: { label: 'Data Privacy Notice', href: '/legal/privacy' },
};

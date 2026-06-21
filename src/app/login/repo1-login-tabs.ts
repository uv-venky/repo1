import type { LoginTabConfig } from 'venky-core/ui';

/** Repo1 uses credentials login only — no tab switcher. */
export const REPO1_LOGIN_TABS: LoginTabConfig[] = [
  { id: 'sign-in', label: 'Sign In', type: 'credentials' },
];

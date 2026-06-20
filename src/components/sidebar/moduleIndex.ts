import { adminModules } from 'venky-core/server/sidebar';
import type { ServerTeam } from 'venky-core/ui';

export const adminPortal: ServerTeam = {
  name: 'Administration',
  logo: 'MiniLogo',
  teamPath: '/admin',
  modules: adminModules,
  oneLevelNav: [],
};

export const teams: ServerTeam[] = [adminPortal];

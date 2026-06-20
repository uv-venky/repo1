'use client';

import { usePathname } from 'next/navigation';
import { showError } from 'venky-core/ui';
import type { PageItem, SidebarAction, Team } from 'venky-core/ui';

export function useSidebarActions() {
  return (actionName: SidebarAction, _path: string) => {
    showError(`Unknown sidebar action: ${actionName}`);
  };
}

export function isSidebarItemActive(pathname: string, item: PageItem, team: Team): boolean {
  const fullUrl = `${team.teamPath}${item.pagePath}`;

  if (pathname.startsWith(fullUrl)) {
    return true;
  }

  return team.oneLevelNav.some(
    (p) => item.pagePath === p.parentPagePath && pathname.startsWith(`${team.teamPath}${p.pagePath}`),
  );
}

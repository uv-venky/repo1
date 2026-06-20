'use server';

import type { Session } from 'venky-core/auth';
import type { PgPoolClient } from 'venky-core/server';
import { ACTION_ACCESS_ROLES, type ActionName, type ActionOutput, type ActionParams, ACTIONS } from '.';

export async function invokeAction<T extends ActionName>(
  client: PgPoolClient,
  session: Session,
  action: T,
  ...args: ActionParams<T>
) {
  const actionFn = ACTIONS[action] as unknown as (
    client: PgPoolClient,
    session: Session,
    ...args: ActionParams<T>
  ) => Promise<ActionOutput<T>>;
  if (!actionFn) {
    throw new Error(`Action ${action} not found!`);
  }
  const accessRoles = ACTION_ACCESS_ROLES[action];
  if (
    !accessRoles.some((role) => {
      if (role === 'all_users') {
        return session.user.userName !== 'guest';
      }
      return session.user.roles.includes(role);
    })
  ) {
    throw new Error(`You do not have access to action ${action}!`);
  }
  return actionFn(client, session, ...args);
}

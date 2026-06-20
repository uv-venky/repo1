import type { Session } from 'venky-core/auth';
import type { PgPoolClient } from 'venky-core/server';
import { coreActions } from 'venky-core/server';

export const ACTIONS = {
  ...coreActions.ACTIONS,
};

export type ActionName = coreActions.ActionName;

export const ACTION_ACCESS_ROLES: Record<ActionName, string[]> = {
  ...coreActions.ACTION_ACCESS_ROLES,
};

export const WORKFLOW_CALLABLE_ACTIONS: readonly string[] = [...coreActions.WORKFLOW_CALLABLE_ACTIONS];

export type ActionParams<T extends ActionName> = (typeof ACTIONS)[T] extends (
  client: PgPoolClient,
  session: Session,
  ...args: infer P extends unknown[]
) => any
  ? P
  : (typeof ACTIONS)[T] extends (client: PgPoolClient, ...args: infer P extends unknown[]) => any
    ? P
    : never;

export type ActionOutput<T extends ActionName> = ReturnType<(typeof ACTIONS)[T]>;

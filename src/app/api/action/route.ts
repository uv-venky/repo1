import { logger } from 'venky-core/server';
import type { PgPoolClient } from 'venky-core/server';
import type { ActionName, ActionParams } from '@/lib/server/actions';
import { invokeAction } from '@/lib/server/actions/invoke';
import { logActivity } from 'venky-core/server';
import { withDBSessionRoute } from 'venky-core/server';
import type { Session } from 'venky-core/auth';
import { after } from 'next/server';
import { isAbortedRequestError, UserError } from 'venky-core/common';

function parseActionRequest<T extends ActionName>(body: unknown): [T, ActionParams<T>] {
  const [action, ...rest] = body as [T, ...unknown[]];
  return [action, rest as ActionParams<T>];
}

export const POST = withDBSessionRoute(async function callback<T extends ActionName>(
  client: PgPoolClient,
  session: Session,
  req: Request,
) {
  const start = performance.now();

  if (!req) {
    logger.error('Request object is undefined in /api/action route');
    throw new Error('Request object is undefined in /api/action route');
  }

  let body: unknown;
  try {
    if (typeof req.json !== 'function') {
      logger.error('req.json is not a function', { reqType: typeof req, reqKeys: Object.keys(req || {}) });
      throw new Error('req.json is not a function');
    }
    body = await req.json();
  } catch (error) {
    if (isAbortedRequestError(error)) {
      return new Response(null, { status: 499 });
    }
    if (error instanceof SyntaxError && error.message.includes('Unexpected end of JSON input')) {
      return new Response(null, { status: 499 });
    }
    logger.error('Failed to parse request body:', error);
    throw new UserError('Invalid request body');
  }

  const [action, params] = parseActionRequest<T>(body);

  logger.setContext('dataSource', action);
  logger.setContext('apiName', 'action');
  if (logger.debugEnabled) {
    logger.debug('Start', action, ...params);
  }

  const result = await invokeAction(client, session, action, ...params);

  if (logger.debugEnabled) {
    logger.debug(
      'End',
      action,
      `${Math.round(performance.now() - start)}ms`,
      Array.isArray(result) ? `${result.length} rows` : undefined,
    );
  }

  const elapsedTimeMs = Math.round(performance.now() - start);
  const rowCount = Array.isArray(result) ? result.length : 0;
  const createdAt = new Date().toISOString();

  after(async () => {
    await logActivity({
      userName: session.user.userName,
      eventType: 'Action',
      eventId: action,
      metadata: {
        params,
      },
      rowCount,
      elapsedTimeMs,
      sessionId: session.id,
      createdAt,
    });
  });

  return Response.json({ status: 'OK', result });
});

export const runtime = 'nodejs';

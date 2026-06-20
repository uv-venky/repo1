import { getUserSession } from 'venky-core/server';
import { getErrorMessage, isErrorResponse } from 'venky-core/common';

export async function GET() {
  try {
    const session = await getUserSession();
    if (isErrorResponse(session)) {
      return Response.json(session, { status: 401 });
    }
    if (session === null) {
      return Response.json({ status: 'OK', data: null }, { status: 401 });
    }
    return Response.json({ status: 'OK', data: session });
  } catch (error) {
    return Response.json({ status: 'ERROR', message: getErrorMessage(error) }, { status: 500 });
  }
}

export const runtime = 'nodejs';

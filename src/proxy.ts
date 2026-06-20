import type { NextRequest } from 'next/server';
import { init } from './lib/server/init/init';
import logger from 'venky-core/server/logger';
import type { ProxyCoreOptions } from 'venky-core/server';

type ProxyHandler = (req: NextRequest, options?: ProxyCoreOptions) => Promise<Response>;

let proxyCoreImpl: ProxyHandler | null = null;

export default async function proxy(req: NextRequest) {
  if (!proxyCoreImpl) {
    await init();
    logger.info('Initializing proxy core');
    const { proxyCore } = await import('venky-core/server');
    proxyCoreImpl = proxyCore as unknown as ProxyHandler;
  }

  return proxyCoreImpl!(req);
}

export const config = {
  matcher: [
    '/((?!api/auth|robots.txt|.well-known/appspecific|.*\\.png$|.*\\.jpg$|.*\\.jpeg$|.*\\.ico$|.*\\.webp$|.*\\.svg$).*)',
  ],
};

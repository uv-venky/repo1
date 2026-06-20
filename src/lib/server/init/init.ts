import { initVenkyApp } from 'venky-core/server/boot';

export async function init() {
  await initVenkyApp({
    loadServerConfig: () => import('./server-config'),
    appDsDefsResolve: require.resolve('../ds/defs'),
    serverConfigResolve: require.resolve('./server-config'),
    onAfterInit: async () => {
      const { registerAppSSEAuthorizers } = await import('./sse-authorizers');
      registerAppSSEAuthorizers();
    },
  });
}

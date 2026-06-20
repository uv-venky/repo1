import { registerAppSSEAuthorizers as registerCoreSSEAuthorizers } from 'venky-core/server';

export function registerAppSSEAuthorizers(): void {
  registerCoreSSEAuthorizers();
}

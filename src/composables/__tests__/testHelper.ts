import { createApp, type App } from 'vue';

/**
 * Run a composable inside a throwaway app instance so that
 * lifecycle hooks (onUnmounted, etc.) are registered correctly.
 */
export function withSetup<T>(composable: () => T): [T, App] {
  let result!: T;
  const app = createApp({
    setup() {
      result = composable();
      return () => {};
    },
  });
  app.mount(document.createElement('div'));
  return [result, app];
}

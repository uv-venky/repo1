export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    const { installCoreOomRecorder } = await import('venky-core/server/boot/oom-recorder');
    await installCoreOomRecorder();

    const { registerCoreInstrumentation } = await import('venky-core/server/boot/instrumentation');
    await registerCoreInstrumentation();
  }
}

export async function onRequestError(err: Error, request: { path: string; method: string }): Promise<void> {
  const { onCoreRequestError } = await import('venky-core/server/boot/instrumentation');
  await onCoreRequestError(err, request);
}

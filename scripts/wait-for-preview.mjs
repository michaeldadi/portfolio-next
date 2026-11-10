const origin = process.env.TEST_ORIGIN ?? 'http://127.0.0.1:4321';
let connected = false;
for (let attempt = 0; attempt < 100; attempt++) {
  try {
    const response = await fetch(origin, { signal: AbortSignal.timeout(1000) });
    if (response.ok) {
      connected = true;
      break;
    }
  } catch {
    /* The local Worker is still starting. */
  }
  await new Promise((resolve) => setTimeout(resolve, 200));
}
if (!connected) throw new Error('The local preview did not become ready.');

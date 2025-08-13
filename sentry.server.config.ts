import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: 'https://3049d04e7f1c6940bf55b86eaea6606c@o4509838598930432.ingest.us.sentry.io/4509838601224192',
  tracesSampleRate: 0.25,
  enableLogs: true,
  debug: false,
});

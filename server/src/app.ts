import { startTorrentProxyApi } from './domain/torrent-proxy/start-api';
import { createLifecycleManager } from './util/lifecycle';
import { standardLogger } from './util/logging';

const logger = standardLogger();
const lifecycle = createLifecycleManager();

process
  .on(`uncaughtException`, async error => {
    logger.error({ message: `Unhandled exception outside main loop`, error });
    await lifecycle.cleanup();
    process.exitCode = 1;
  })
  .on(`unhandledRejection`, async reason => {
    logger.error({ message: `Unhandled promise rejection`, reason });
    await lifecycle.cleanup();
    process.exitCode = 1;
  })
  .on(`SIGTERM`, async () => {
    logger.info(`SIGTERM signal received`);
    await lifecycle.cleanup();
  });

(async () => {
  startTorrentProxyApi(logger, lifecycle);
})().catch(async error => {
  logger.error({ message: `Unhandled exception in main loop`, error });
  await lifecycle.cleanup();
  process.exitCode = 1;
});

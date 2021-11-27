import express from 'express';
import { errorLogger } from 'express-winston';
import { Logger } from 'winston';
import { v4 as uuid } from 'uuid';
import { errorHandler, notFoundHandler } from '../../util/express';
import { healthRouter } from '../../util/health';
import { LifecycleManager } from '../../util/lifecycle';
import { requestLogger } from '../../util/logging';
import { proxiedVideoStreamCreateCommandHandler } from './create-handler';
import { torrentProxyApiRouter } from './router';
import { torrentServiceFactory } from './torrent/service';
import { inMemoryTorrentStateRepository } from './torrent/repository';
import { proxiedVideoStreamQueryHandler } from './query-handler';

interface StremioConfig {
  addonUrls?: string[]
  trackers?: string[]
}

const env = {
  port: process.env.PORT as string,
  stremioConfig: JSON.parse(process.env.STREMIO_CONFIG ?? `{}`) as StremioConfig,
};

export const startTorrentProxyApi = (
  logger: Logger,
  lifecycle: LifecycleManager,
) => {

  const torrentService = torrentServiceFactory(lifecycle, logger, env?.stremioConfig?.trackers ?? []);
  const repository = inMemoryTorrentStateRepository();
  const createStream = proxiedVideoStreamCreateCommandHandler(torrentService, repository, () => uuid());
  const queryStream = proxiedVideoStreamQueryHandler(repository);

  const api = express()
    .use(requestLogger(logger))
    .use(healthRouter())
    .use(`/`, torrentProxyApiRouter(createStream, queryStream, env?.stremioConfig?.addonUrls ?? []))
    .use(notFoundHandler)
    .use(errorLogger(logger))
    .use(errorHandler)
    .listen(env.port, () => logger.info(`Listening on port: ${env.port}`));

  const closeApi = () => new Promise<void>(resolve => api.close(() => resolve()));
  lifecycle.registerCleanupCallback(closeApi);
}

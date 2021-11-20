import { Logger } from 'winston';
import { LifecycleManager } from '../../../util/lifecycle';
import WebTorrent from 'webtorrent';

export interface Torrent {
  getLength: () => number
  getProgress: () => number
  getPath: () => string
  getTimeRemaining: () => number
  destroy: () => void
  createReadStream: (start: number, end: number) => NodeJS.ReadableStream
}

export interface TorrentService {
  (magnet: string): Promise<Torrent>
}

export const torrentServiceFactory = (
  lifecycle: LifecycleManager,
  logger: Logger,
): TorrentService => {

  const client = new WebTorrent({ maxConns: 100 });
  client.on('error', error => logger.error(error));

  const largestMp4File = (files: WebTorrent.TorrentFile[]) => files
    .filter(file => file.path.endsWith(`.mp4`))
    .sort((a, b) => a.length - b.length)
    .find(() => true);

  return magnet => new Promise((resolve, reject) => {
    client.add(magnet, { strategy: `sequential`, path: `/tmp/torrents/`, destroyStoreOnDestroy: true }, torrent => {
      const file = largestMp4File(torrent.files);
      if (!file) return reject('No mp4 files found in torrent');

      lifecycle.registerCleanupCallback(async () => torrent.destroy())

      return resolve({
        destroy: () => torrent.destroy(),
        getLength: () => file.length,
        getPath: () => file.path,
        getProgress: () => file.progress,
        getTimeRemaining: () => torrent.timeRemaining,
        createReadStream: (start: number, end: number) => file.createReadStream({ start, end }),
      });
    });
  });
};

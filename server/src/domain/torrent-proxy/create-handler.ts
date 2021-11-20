import { TorrentStateRepository } from './torrent/repository';
import { TorrentService } from './torrent/service';

export interface ProxiedVideoStreamCreateCommandHandler {
  (magnet: string): Promise<{ streamId: string }>
}

export const proxiedVideoStreamCreateCommandHandler = (
  startTorrent: TorrentService,
  repository: TorrentStateRepository,
  uuidAccessor: () => string,
): ProxiedVideoStreamCreateCommandHandler =>
  async magnet => {
    const streamId = uuidAccessor();

    const torrent = await startTorrent(magnet);
    await repository.save(streamId, torrent);

    return { streamId }
  };

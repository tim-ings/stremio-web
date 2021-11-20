import { TorrentStateRepository } from './torrent/repository';

interface ProxiedVideoStream {
  length: number
  type: 'video/mp4'
  read: (start: number, end: number) => NodeJS.ReadableStream
}

export interface ProxiedVideoStreamQueryHandler {
  (streamId: string): Promise<ProxiedVideoStream | undefined>
}

export const proxiedVideoStreamQueryHandler = (
  repository: TorrentStateRepository,
): ProxiedVideoStreamQueryHandler =>
  async streamId => {
    const torrent = await repository.load(streamId);
    if (!torrent) return;

    return {
      length: torrent.getLength(),
      type: `video/mp4`,
      read: (start, end) => torrent.createReadStream(start, end),
    };
  };

import { Torrent } from './service';

export interface TorrentStateRepository {
  save: (streamId: string, state: Torrent) => Promise<void>
  load: (streamId: string) => Promise<Torrent | undefined>
}

export const inMemoryTorrentStateRepository = (): TorrentStateRepository => {
  const store = new Map<string, Torrent>();

  return {
    save: async (streamId, state) => { store.set(streamId, state); },
    load: async streamId => store.get(streamId),
  }
}

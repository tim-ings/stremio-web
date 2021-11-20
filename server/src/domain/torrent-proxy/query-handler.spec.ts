import { ProxiedVideoStreamQueryHandler, proxiedVideoStreamQueryHandler } from './query-handler';
import { inMemoryTorrentStateRepository, TorrentStateRepository } from './torrent/repository';
import { Torrent } from './torrent/service';

describe(`query handler`, () => {

  let repository: TorrentStateRepository;
  let query: ProxiedVideoStreamQueryHandler;

  beforeEach(() => {
    repository = inMemoryTorrentStateRepository();
    query = proxiedVideoStreamQueryHandler(repository);
  })

  test(`given no state > when query > should return undefined`, async () => {
    await expect(query(`stream-123`)).resolves.toBeUndefined();
  });

  test(`given state > when query > should return expected state`, async () => {
    const torrent: Torrent = {
      createReadStream: (start, end) => `stream ${start}:${end}` as any,
      getLength: () => 123,
      destroy: () => {},
      getPath: () => `/foo/bar/baz`,
      getProgress: () => 234,
      getTimeRemaining: () => 345,
    };

    await repository.save(`stream-123`, torrent);

    const stream = await query(`stream-123`);
    expect(stream?.length).toBe(123);
    expect(stream?.type).toBe(`video/mp4`);
    expect(stream?.read(123, 234)).toBe(`stream 123:234`);
  });
});

import { inMemoryTorrentStateRepository, TorrentStateRepository } from './repository';

describe(`torrent state repository`, () => {
  let repository: TorrentStateRepository;

  beforeEach(() => {
    repository = inMemoryTorrentStateRepository();
  })

  test(`given no state > when load > should return undefined`, async () => {
    await expect(repository.load(`stream-123`)).resolves.toBeUndefined();
  });

  test(`given no state > when save, load > should save and load expected state`, async () => {
    await repository.save(`stream-123`, { foo: 123 } as any);

    await expect(repository.load(`stream-123`)).resolves.toEqual({ foo: 123 });
  });

  test(`given state > when save new state with same id > should overwrite state`, async () => {
    await repository.save(`stream-123`, { foo: 123 } as any);
    await repository.save(`stream-123`, { foo: 234 } as any);

    await expect(repository.load(`stream-123`)).resolves.toEqual({ foo: 234 });
  });
});

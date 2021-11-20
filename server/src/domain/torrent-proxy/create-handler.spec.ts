import { ProxiedVideoStreamCreateCommandHandler, proxiedVideoStreamCreateCommandHandler } from './create-handler';
import { inMemoryTorrentStateRepository, TorrentStateRepository } from './torrent/repository';

describe(`create handler`, () => {

  const startTorrent = jest.fn();
  const uuidAccessor = jest.fn();
  let repository: TorrentStateRepository;
  let handle: ProxiedVideoStreamCreateCommandHandler;

  beforeEach(() => {
    jest.resetAllMocks();
    repository = inMemoryTorrentStateRepository();
    handle = proxiedVideoStreamCreateCommandHandler(startTorrent, repository, uuidAccessor);
  })

  test(`given magnet > when handle > should start torrent, save state, and return stream id`, async () => {
    uuidAccessor.mockReturnValue(`stream-123`);
    startTorrent.mockResolvedValue({ torrentState: 123 });

    await expect(handle(`magnet-123`)).resolves.toEqual({ streamId: `stream-123` });
    await expect(repository.load(`stream-123`)).resolves.toEqual({ torrentState: 123 });
    expect(startTorrent).toHaveBeenCalledWith(`magnet-123`);
  })
});

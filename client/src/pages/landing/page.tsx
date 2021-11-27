import React, { useContext } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router';
import { AppContext } from '../../app/context';
import { RouteBuilder } from '../../app/routes';
import { useCreateProxyStream } from '../../app/proxy/use-create-stream';
import { StremioMeta, StremioStream } from '../../app/stremio/types';
import { useFetchStreams } from '../../app/stremio/use-fetch-streams';
import { Page } from '../../components/page';
import { SearchInput } from './components/search-input';
import { SearchResultCard } from './components/search-result';
import { StreamCard } from './components/stream-card';
import parseTorrent from 'parse-torrent';
import './page.css';

export const LandingPage: React.FC = () => {
  const { state: { searchResults, availableStreams } } = useContext(AppContext);

  const navigate = useNavigate();
  const createStream = useCreateProxyStream();
  const fetchStreams = useFetchStreams();

  const onResultClicked = async (result: StremioMeta) => {
    fetchStreams(result);

    return
  };

  const onStreamClicked = async (stream: StremioStream) => {
    if (!stream.infoHash) throw Error(`Unsupported stream type`);
    const magnet = parseTorrent.toMagnetURI({ infoHash: stream.infoHash });
    const streamId = await createStream(magnet);
    navigate(RouteBuilder.Watch(streamId));
  }

  return (
    <Page>
      <Helmet>
        <title>Stremio Proxy</title>
      </Helmet>
      <div className='search-container'>
        <SearchInput />
        <ul className='search-results'>
          {availableStreams && availableStreams.map((stream, idx) => <StreamCard key={idx} stream={stream} onClick={() => onStreamClicked(stream)} />)}
        </ul>
        <ul className='search-results'>
          {searchResults && searchResults.map(result => <SearchResultCard key={result.id} result={result} onClicked={() => onResultClicked(result)} />)}
        </ul>
      </div>
    </Page>
  );
};

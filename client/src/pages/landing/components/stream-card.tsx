import React from 'react';
import { StremioStream } from '../../../app/stremio/types';

interface StreamCardProps {
  onClick: (stream: StremioStream) => void
  stream: StremioStream
}

export const StreamCard: React.FC<StreamCardProps> = ({ onClick, stream }) => {
  switch (true) {
    case stream.url !== undefined: return <UrlStreamCard onClick={onClick} stream={stream} />
    case stream.ytId !== undefined: return <YoutubeStreamCard onClick={onClick} stream={stream} />
    case stream.infoHash !== undefined: return <TorrentStreamCard onClick={onClick} stream={stream} />
    case stream.externalUrl !== undefined: return <ExternalUrlStreamCard onClick={onClick} stream={stream} />
  }
  return <BaseStreamCard onClick={onClick} stream={stream}>ERROR</BaseStreamCard>
}

const BaseStreamCard: React.FC<StreamCardProps> = ({ onClick, stream, children }) =>
  <div className='stream-card'>
    <button onClick={() => onClick(stream)}>
      {children}
    </button>
  </div>

const UrlStreamCard: React.FC<StreamCardProps> = ({ onClick, stream }) =>
  <BaseStreamCard onClick={onClick} stream={stream}>
    URL: {stream.title} - {stream.url}
  </BaseStreamCard>

const YoutubeStreamCard: React.FC<StreamCardProps> = ({ onClick, stream }) =>
  <BaseStreamCard onClick={onClick} stream={stream}>
    YOUTUBE: {stream.title} - {stream.ytId}
  </BaseStreamCard>

const TorrentStreamCard: React.FC<StreamCardProps> = ({ onClick, stream }) =>
  <BaseStreamCard onClick={onClick} stream={stream}>
    TORRENT: {stream.name} - {stream.title} - {stream.infoHash}
  </BaseStreamCard>

const ExternalUrlStreamCard: React.FC<StreamCardProps> = ({ onClick, stream }) =>
  <BaseStreamCard onClick={onClick} stream={stream}>
    EXTERNAL: {stream.title} - {stream.externalUrl}
  </BaseStreamCard>

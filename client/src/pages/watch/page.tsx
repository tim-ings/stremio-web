import React from 'react';
import { useParams } from 'react-router';
import { VideoPlayer } from './components/player';

export const WatchPage: React.FC = () => {
  const { streamId } = useParams();
  const videoSrc = `/api/stream/${streamId}`;

  return (
    <div>
      <VideoPlayer src={videoSrc} type='video/mp4' />
    </div>
  );
}
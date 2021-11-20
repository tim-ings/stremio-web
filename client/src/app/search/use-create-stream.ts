import { useCallback } from 'react'

export const useCreateStream = () => {
  return useCallback(async (magnet: string) => {
    const streamId = await createStream(magnet);
    return streamId;
  }, []);
}

const createStream = async (magnet: string) => {
  const response = await fetch(`/api/stream`, {
    method: `POST`,
    headers: { 'Content-Type': `application/json`, 'Accept': `application/json` },
    body: JSON.stringify({ magnet }),
  });

  if (!response.ok) throw Error(`Failed to create stream`);
  const data = await response.json();
  return data.streamId;
};

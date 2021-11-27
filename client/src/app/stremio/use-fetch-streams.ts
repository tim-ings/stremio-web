import { useCallback, useContext } from 'react';
import * as StremioAddonClient from 'stremio-addon-client';
import { ActionType } from '../actions';
import { AppContext } from '../context';
import { StremioManifest, StremioMeta, StremioStream } from './types'

export const useFetchStreams = () => {
  const { dispatch } = useContext(AppContext);

  return useCallback(async (meta: StremioMeta) => {
    const streams = await fetchStreams(meta);
    dispatch({ type: ActionType.StreamsLoaded, streams });
  }, [dispatch]);
}

const fetchAddonUrls = async (): Promise<string[]> => {
  const response = await fetch(`/api/addons`);
  const data = await response.json();
  return data.addonUrls;
}

const fetchStreams = async (meta: StremioMeta): Promise<StremioStream[]> => {
  const addonUrls = await fetchAddonUrls();
  const results = await allResolved<{ addon: { get: Function, manifest: StremioManifest } }>(addonUrls.map(url => StremioAddonClient.detectFromURL(url)));
  const addons = results.map(({ addon }) => addon);

  const streamResults = await allResolved<{ streams: StremioStream[] }>(addons.flatMap(addon => addon.get('stream', meta.type, meta.id)));
  return streamResults.flatMap(result => result.streams);
};

const allResolved = async <T>(promises: Array<Promise<T>>): Promise<Array<T>> =>
  Object.values((await Promise.allSettled(promises)))
    .filter((result): result is PromiseFulfilledResult<T> => result.status === 'fulfilled')
    .map(({ value }) => value);

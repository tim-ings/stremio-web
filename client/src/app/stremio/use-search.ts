import { useCallback, useContext } from 'react';
import * as StremioAddonClient from 'stremio-addon-client';
import * as StremioAggregator from 'stremio-aggregators';
import * as OfficialStremioAddons from 'stremio-official-addons';
import { ActionType } from '../actions';
import { AppContext } from '../context';
import { StremioMeta } from './types';

export const useSearch = () => {
  const { dispatch } = useContext(AppContext);

  return useCallback(async (terms: string) => {
    const results = await searchCatalogs(terms);
    dispatch({ type: ActionType.SearchResultsLoaded, results });
  }, [dispatch]);
}

const searchCatalogs = async (terms: string): Promise<StremioMeta[]> => {
  const collection = new StremioAddonClient.AddonCollection();
  collection.load(OfficialStremioAddons);
  const aggregator = new StremioAggregator.Catalogs(collection.getAddons());
  aggregator.run();

  const addons = aggregator.results.map(({ addon }: any) => addon);
  const results = await Promise.allSettled(addons.flatMap((addon: any) => [
    addon.get('catalog', 'series', 'top', { search: terms }),
    addon.get('catalog', 'movie', 'top', { search: terms }),
  ]));

  const resolvedMetas = Object.values(results)
    .filter((result): result is PromiseFulfilledResult<{ metas: StremioMeta[] }> => result.status === 'fulfilled')
    .map(({ value }) => value)
    .flatMap(({ metas }) => metas);

  return uniqueBy(resolvedMetas, meta => meta.id).sort(byScore);
};

const byScore = (a: StremioMeta, b: StremioMeta) => (b.score ?? 0) - (a.score ?? 0);

const uniqueBy = <T, K>(elements: T[], pickKey: (v: T) => K) => {
  const map = new Map<K, T>();
  for (const element of elements) {
    const key = pickKey(element);
    const existing = map.get(key);
    map.set(key, { ...existing, ...element });
  }
  return Array.from(map.values());
}

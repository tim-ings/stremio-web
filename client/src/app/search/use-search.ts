import { useCallback, useContext, useEffect, useMemo } from 'react';
import { ActionType } from '../actions';
import { AppContext } from '../context';
import { SearchResult } from './types';
import * as StremioAddonClient from 'stremio-addon-client';
import * as StremioAggregator from 'stremio-aggregators';
// import * as OfficialStremioAddons from 'stremio-official-addons';

export const useSearch = () => {
  const { dispatch } = useContext(AppContext);
  // const stremio = useStremio();

  return useCallback(async (terms: string) => {
    const results = await search(terms);
    // const results = await stremio.search(terms);
    // console.log({ results })
    dispatch({ type: ActionType.SearchResultsLoaded, results });
  }, [dispatch]);
}

// const useStremio = () =>
//   useMemo(() => {
//     const collection = new StremioAddonClient.AddonCollection();
//     collection.load(OfficialStremioAddons);
//     console.log({ StremioAddonClient })
//     const aggregator = new StremioAggregator.Catalogs(collection.getAddons());
//     aggregator.run();

//     return {
//       search: async (terms: string) => {
//         const addons = aggregator.results.map((result: any) => result.addon);
//         console.log({ addons });
//         const results = await Promise.all(addons.map((addon: any) => addon.get(`catalog`, `movie`, `manifest`).catch()));
//         const metas = results.map((result: any) => result.meta);

//         console.log({ aggregator, addons, results, metas });
//         return metas;
//       }
//     };
//   }, []);

const search = async (terms: string): Promise<SearchResult[]> => {
  const catalogResp = await StremioAddonClient.detectFromUrl(catalogUrl);
  const addonResp = await StremioAddonClient.detectFromUrl(addonUrl);
  console.log('got a resp from stremio addon api', { addonResp, catalogResp });
  const catalog = catalogResp.addon;
  const addon = addonResp.addon;

  const results = await catalog.get(`catalog`, `movie`, `top`, { search: terms });
  console.log('search results', { results });
  return results;
};

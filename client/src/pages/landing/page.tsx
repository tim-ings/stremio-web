import React, { useContext, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router';
import { AppContext } from '../../app/context';
import { RouteBuilder } from '../../app/routes';
import { SearchResult } from '../../app/search/types';
import { useCreateStream } from '../../app/search/use-create-stream';
import { Page } from '../../components/page';
import { SearchInput } from './components/search-input';
import { SearchResultCard } from './components/search-result';
import './page.css';

const client = require('stremio-addon-client')
const officialAddonsDescriptors = require('stremio-official-addons')
const aggregators = require('stremio-aggregators')

// const useTemp = () => {

//   useEffect(() => {
//     const collection = new client.AddonCollection()

//     // Load official add-ons
//     collection.load(officialAddonsDescriptors)

//     console.log({ collection } )

//     // Create an aggregator to get all rows
//     const aggr = new aggregators.Catalogs(collection.getAddons())

//     // Each time 'updated' is emitted you should re-fresh the view
//     aggr.evs.on('updated', function() {
//       // iterate through aggr.results
//       // each result is a row of items that you have to display
//       aggr.results.forEach(function(result: any) {
//         console.log(result)
//         // each object in result.response.metas is an item that you have to display
//         //if (result.response && result.response.metas)
//       })

//     })

//     console.log({ aggr })

//     // Trigger the actual request proces
//     aggr.run();

//   }, []);

// };

export const LandingPage: React.FC = () => {
  const { state: { searchResults } } = useContext(AppContext);

  const navigate = useNavigate();
  const createStream = useCreateStream();

  // useTemp();

  const onResultClicked = async (result: SearchResult) => {
    console.log(`clicked`, { result });
    const streamId = await createStream(result.magnet);
    navigate(RouteBuilder.Watch(streamId));
  };

  return (
    <Page>
      <Helmet>
        <title>Stremio Proxy</title>
      </Helmet>
      <div className='search-container'>
        <SearchInput />
        <ul className='search-results'>
          {searchResults.map(result => <SearchResultCard key={result.id} result={result} onClicked={() => onResultClicked(result)} />)}
        </ul>
      </div>
    </Page>
  );
};

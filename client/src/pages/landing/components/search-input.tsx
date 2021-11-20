import React, { useState } from 'react';
import { useSearch } from '../../../app/search/use-search';
import './search-input.css';

export const SearchInput: React.FC = () => {
  const [searchTerms, setSearchTerms] = useState(``);
  const search = useSearch();

  const searchInputOnKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') search(searchTerms);
  }

  return (
    <input
      className='search-input'
      value={searchTerms}
      onChange={event => setSearchTerms(event.target.value)}
      onKeyDown={searchInputOnKeyDown}
    />
  )
}
import React from 'react';
import { SearchResult } from '../../../app/search/types';
import './search-result.css';

interface SearchResultCardProps {
  result: SearchResult
  onClicked: () => void
}

export const SearchResultCard: React.FC<SearchResultCardProps> = ({ result: { title, description, thumbnail }, onClicked }) =>
  <div className='search-result-card'>
    <div className='search-result-thumbnail-container'>
      <img className='search-result-thumbnail' src={thumbnail} alt={title} />
    </div>
    <div className='search-result-details-container'>
      <h3 className='search-result-title'>
        <button onClick={onClicked} >{title}</button>
      </h3>
      <p className='search-result-Description'>{description}</p>
    </div>
  </div>

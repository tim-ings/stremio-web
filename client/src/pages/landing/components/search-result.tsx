import React from 'react';
import { StremioMeta } from '../../../app/stremio/types';
import './search-result.css';

interface SearchResultCardProps {
  result: StremioMeta
  onClicked: () => void
}

export const SearchResultCard: React.FC<SearchResultCardProps> = ({ result: { name, description, poster }, onClicked }) =>
  <div className='search-result-card'>
    <div className='search-result-thumbnail-container'>
      <img className='search-result-thumbnail' src={poster} alt={name} />
    </div>
    <div className='search-result-details-container'>
      <h3 className='search-result-title'>
        <button onClick={onClicked} >{name}</button>
      </h3>
      <p className='search-result-Description'>{description}</p>
    </div>
  </div>;
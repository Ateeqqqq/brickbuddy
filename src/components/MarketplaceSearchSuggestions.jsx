import React from 'react';
import { Layers3, Package, Store } from 'lucide-react';
import { flattenSearchResults } from '../utils/marketplaceSearch';

const groups = [
  ['Products', 'products', Package],
  ['Suppliers', 'vendors', Store],
  ['Categories', 'categories', Layers3],
];

function HighlightedText({ value, query }) {
  const normalizedQuery = query.trim();
  if (!normalizedQuery) return value;
  const parts = value.split(new RegExp(`(${normalizedQuery.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'ig'));
  return parts.map((part, index) => (
    part.toLowerCase() === normalizedQuery.toLowerCase()
      ? <mark key={`${part}-${index}`}>{part}</mark>
      : part
  ));
}

export default function MarketplaceSearchSuggestions({
  results,
  query,
  activeIndex,
  onSelect,
  className = '',
}) {
  const allResults = flattenSearchResults(results);
  if (!allResults.length) {
    return <div className={`${className} marketplace-search-no-results`}>No matching products or suppliers found.</div>;
  }

  let resultIndex = 0;
  return (
    <div className={`${className} marketplace-search-groups`} role="listbox">
      {groups.map(([label, key, Icon]) => results[key].length > 0 && (
        <div className="marketplace-search-group" key={label}>
          <span className="marketplace-search-group-title"><Icon size={13} />{label}</span>
          {results[key].map((result) => {
            const currentIndex = resultIndex;
            resultIndex += 1;
            return (
              <button
                type="button"
                role="option"
                aria-selected={activeIndex === currentIndex}
                className={`marketplace-search-option ${activeIndex === currentIndex ? 'active' : ''}`}
                key={`${result.type}-${result.id}`}
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => onSelect(result)}
              >
                <span className={`marketplace-search-result-type ${result.type}`}>{result.type}</span>
                <span className="marketplace-search-result-content">
                  <strong><HighlightedText value={result.name} query={query} /></strong>
                  <small><HighlightedText value={result.meta} query={query} /></small>
                </span>
              </button>
            );
          })}
        </div>
      ))}
    </div>
  );
}

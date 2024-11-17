import React from 'react';
import { SearchFilters as SearchFiltersType } from '../types';

interface SearchFiltersProps {
  filters: SearchFiltersType;
  onChange: (filters: SearchFiltersType) => void;
}

export function SearchFilters({ filters, onChange }: SearchFiltersProps) {
  const handleChange = (key: keyof SearchFiltersType, value: string | number | boolean) => {
    onChange({ ...filters, [key]: value });
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-medium mb-3">Upload Date</h3>
        <div className="space-y-2">
          {['Last hour', 'Today', 'This week', 'This month', 'This year'].map((option) => (
            <label key={option} className="flex items-center">
              <input
                type="radio"
                name="uploadDate"
                value={option}
                checked={filters.uploadDate === option}
                onChange={(e) => handleChange('uploadDate', e.target.value)}
                className="mr-2"
              />
              {option}
            </label>
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-medium mb-3">Duration</h3>
        <div className="space-y-2">
          {['Under 4 minutes', '4-20 minutes', 'Over 20 minutes'].map((option) => (
            <label key={option} className="flex items-center">
              <input
                type="radio"
                name="duration"
                value={option}
                checked={filters.duration === option}
                onChange={(e) => handleChange('duration', e.target.value)}
                className="mr-2"
              />
              {option}
            </label>
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-medium mb-3">Sort By</h3>
        <select
          value={filters.sortBy}
          onChange={(e) => handleChange('sortBy', e.target.value)}
          className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="relevance">Relevance</option>
          <option value="date">Upload date</option>
          <option value="views">View count</option>
          <option value="rating">Rating</option>
        </select>
      </div>

      <div>
        <h3 className="font-medium mb-3">Features</h3>
        <div className="space-y-2">
          {[
            { label: 'HD', key: 'isHD' },
            { label: 'Subtitles/CC', key: 'hasCC' },
            { label: 'Creative Commons', key: 'isCreativeCommons' },
            { label: '4K', key: 'is4K' },
            { label: 'Live', key: 'isLive' },
          ].map(({ label, key }) => (
            <label key={key} className="flex items-center">
              <input
                type="checkbox"
                checked={filters[key as keyof SearchFiltersType] as boolean}
                onChange={(e) => handleChange(key as keyof SearchFiltersType, e.target.checked)}
                className="mr-2"
              />
              {label}
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}
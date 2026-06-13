import { useState, useEffect } from 'react';

const HARDCODED_CATEGORIES = {
  all: { label: 'All', icon: '📍', color: '#C9A84C' },
  hotels: { label: 'Hotels', icon: '🏨', color: '#C9A84C' },
  dining: { label: 'Dining', icon: '🍽', color: '#E8593C' },
  nightlife: { label: 'Nightlife', icon: '🍹', color: '#7B3FA0' },
  beach: { label: 'Beach', icon: '🏖', color: '#1A8A9A' },
  wellness: { label: 'Wellness', icon: '🧘', color: '#2D8A5E' },
  activities: { label: 'Activities', icon: '🛶', color: '#F39C12' },
  shopping: { label: 'Shopping', icon: '🛍️', color: '#E91E63' },
  practical: { label: 'Practical', icon: 'ℹ️', color: '#4A6A8A' },
  cafe: { label: 'Cafe', icon: '☕', color: '#8B4513' },
  bar: { label: 'Bar', icon: '🍸', color: '#9370DB' },
  attraction: { label: 'Attraction', icon: '🎡', color: '#FF6347' },
  culture: { label: 'Culture', icon: '🎭', color: '#C9A84C' }
};

export function useCategories() {
  const [categories, setCategories] = useState(() => HARDCODED_CATEGORIES);

  useEffect(() => {
    fetch('http://localhost:3000/api/categories')
      .then(r => r.ok ? r.json() : [])
      .then(arr => {
        if (!arr?.length) return;
        const map = { ...HARDCODED_CATEGORIES };
        arr.forEach(c => { map[c.id] = { label: c.label, icon: c.icon, color: c.color }; });
        setCategories(map);
      })
      .catch(() => {});
  }, []);

  return categories;
}



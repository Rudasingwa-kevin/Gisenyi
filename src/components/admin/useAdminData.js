import { useState, useEffect, useCallback, useMemo } from 'react';
import { API, fetchWithAuth } from '../../utils/admin';

const PAGE_SIZE = 10;

export function useAdminData(endpoint, { autoLoad = true } = {}) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(autoLoad);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetchWithAuth(`${API}/${endpoint}?limit=500`);
      if (res.ok) {
        const d = await res.json();
        setItems(d.data || d);
      } else {
        setError('Failed to load');
      }
    } catch {
      setError('Network error');
    }
    setLoading(false);
  }, [endpoint]);

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { if (autoLoad) load(); }, [autoLoad, load]);

  const remove = useCallback(async (id) => {
    const res = await fetchWithAuth(`${API}/${endpoint}/${id}`, { method: 'DELETE' });
    if (res.ok) {
      setItems(prev => prev.filter(x => x.id !== id));
      return true;
    }
    return false;
  }, [endpoint]);

  const add = useCallback((item) => {
    setItems(prev => [...prev, item]);
  }, []);

  const update = useCallback((item) => {
    setItems(prev => prev.map(x => x.id === item.id ? item : x));
  }, []);

  return { items, loading, error, load, remove, add, update, setItems };
}

export function useFilteredItems(items, { searchFields = [], sortFn, search, sort, page }) {
  return useMemo(() => {
    let filtered = items;

    if (search) {
      const q = search.toLowerCase();
      filtered = filtered.filter(item =>
        searchFields.some(field => {
          const value = field.split('.').reduce((obj, k) => obj?.[k], item);
          return value?.toLowerCase().includes(q);
        })
      );
    }

    if (sortFn) {
      filtered = [...filtered].sort(sortFn(sort));
    }

    const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
    const safePage = Math.min(page, totalPages || 1);
    const start = (safePage - 1) * PAGE_SIZE;

    return {
      items: filtered.slice(start, start + PAGE_SIZE),
      page: safePage,
      totalPages,
      total: filtered.length,
    };
  }, [items, searchFields, sortFn, search, sort, page]);
}

export { PAGE_SIZE };

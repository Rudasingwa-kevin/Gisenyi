import { useEffect } from 'react';

export function useUnsavedChanges(hasChanges) {
  useEffect(() => {
    if (!hasChanges) return;
    const handler = (e) => {
      e.preventDefault();
      e.returnValue = '';
    };
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, [hasChanges]);
}

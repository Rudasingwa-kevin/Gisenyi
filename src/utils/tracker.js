import { API_BASE } from './api';

function getSessionId() {
  let id = localStorage.getItem('visitor_id');
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem('visitor_id', id);
  }
  return id;
}

let lastPage = null;

export function trackPage(page) {
  if (page === lastPage) return;
  lastPage = page;

  const data = { sessionId: getSessionId(), page, referrer: document.referrer || '' };
  const body = JSON.stringify(data);
  if (navigator.sendBeacon) {
    navigator.sendBeacon(`${API_BASE}/api/track`, new Blob([body], { type: 'application/json' }));
  } else {
    fetch(`${API_BASE}/api/track`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body,
    }).catch(() => {});
  }
}

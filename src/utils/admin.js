import { API_BASE } from './api';

export const API = `${API_BASE}/api/admin`;
export const UPLOAD_API = `${API_BASE}/api/upload`;

export function fetchWithAuth(url, opts = {}) {
  return fetch(url, {
    ...opts,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...opts.headers
    }
  });
}

export async function uploadFile(file) {
  const fd = new FormData();
  fd.append('file', file);
  const res = await fetch(UPLOAD_API, {
    method: 'POST',
    credentials: 'include',
    body: fd
  });
  if (!res.ok) throw new Error('Upload failed');
  return res.json();
}

import { API_BASE } from './api';

export const API = `${API_BASE}/api/admin`;
export const UPLOAD_API = `${API_BASE}/api/upload`;

export function fetchWithAuth(url, token, opts = {}) {
  return fetch(url, {
    ...opts,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      ...opts.headers
    }
  });
}

export async function uploadFile(file, token) {
  const fd = new FormData();
  fd.append('image', file);
  const res = await fetch(UPLOAD_API, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${token}` },
    body: fd
  });
  if (!res.ok) throw new Error('Upload failed');
  return res.json();
}

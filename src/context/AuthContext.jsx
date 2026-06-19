import { createContext, useContext, useState, useEffect } from 'react';
import { API_BASE } from '../utils/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [username, setUsername] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if already logged in via cookie
    fetch(`${API_BASE}/api/auth/me`, { credentials: 'include' })
      .then(res => {
        if (res.ok) return res.json();
        throw new Error('Not authenticated');
      })
      .then(data => {
        setUsername(data.username);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const login = async (user, pass) => {
    const res = await fetch(`${API_BASE}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ username: user, password: pass })
    });
    if (!res.ok) throw new Error('Invalid credentials');
    const data = await res.json();
    setUsername(data.username);
    return data;
  };

  const logout = async () => {
    await fetch(`${API_BASE}/api/auth/logout`, {
      method: 'POST',
      credentials: 'include',
    });
    setUsername(null);
  };

  const isAdmin = !!username;

  return (
    <AuthContext.Provider value={{ username, isAdmin, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);

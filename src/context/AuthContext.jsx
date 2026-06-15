import { createContext, useContext, useState, useEffect } from 'react';
import { API_BASE } from '../utils/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem('admin_token'));
  const [username, setUsername] = useState(localStorage.getItem('admin_username'));

  useEffect(() => {
    if (token) localStorage.setItem('admin_token', token);
    else localStorage.removeItem('admin_token');
  }, [token]);

  useEffect(() => {
    if (username) localStorage.setItem('admin_username', username);
    else localStorage.removeItem('admin_username');
  }, [username]);

  const login = async (user, pass) => {
    const res = await fetch(`${API_BASE}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: user, password: pass })
    });
    if (!res.ok) throw new Error('Invalid credentials');
    const data = await res.json();
    setToken(data.token);
    setUsername(data.username);
    return data;
  };

  const logout = () => {
    setToken(null);
    setUsername(null);
  };

  const isAdmin = !!token;

  return (
    <AuthContext.Provider value={{ token, username, isAdmin, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);

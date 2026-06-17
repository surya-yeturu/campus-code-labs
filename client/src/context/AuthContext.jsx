import { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('learnovate_user');
    return stored ? JSON.parse(stored) : null;
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      if (user?.token) {
        try {
          const { data } = await api.get('/auth/profile');
          const updated = { ...user, ...data.data };
          setUser(updated);
          localStorage.setItem('learnovate_user', JSON.stringify(updated));
        } catch {
          logout();
        }
      }
      setLoading(false);
    };
    init();
  }, []);

  const login = async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password });
    const userData = data.data;
    setUser(userData);
    localStorage.setItem('learnovate_user', JSON.stringify(userData));
    return userData;
  };

  const register = async (formData) => {
    const { data } = await api.post('/auth/register', formData);
    const userData = data.data;
    setUser(userData);
    localStorage.setItem('learnovate_user', JSON.stringify(userData));
    return userData;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('learnovate_user');
  };

  const updateUser = (updates) => {
    const updated = { ...user, ...updates };
    setUser(updated);
    localStorage.setItem('learnovate_user', JSON.stringify(updated));
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateUser, isAdmin: user?.role === 'admin' }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

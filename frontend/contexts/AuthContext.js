import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/v1/auth/me', {
          credentials: 'include',
        });
        if (res.ok) {
          const data = await res.json();
          setUser(data);
          setToken(true);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchUser();
  }, []);

  const login = (userData) => {
    setUser(userData);
    setToken(true);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ token, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

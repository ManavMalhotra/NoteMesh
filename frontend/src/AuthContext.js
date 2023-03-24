import { createContext, useContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : {
      name: '',
      token: '',
      auth: false,
    }
  });

  useEffect(() => {
    localStorage.setItem('user', JSON.stringify(user));
  }, [user]);



  return (
      <AuthContext.Provider value={{user, setUser}}>
        {children}
      </AuthContext.Provider>
  )
}

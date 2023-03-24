import { createContext, useContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState({
    name: '',
    token: '',
    auth: false,
  });

  useEffect(() => {
  },[])


  


  return (<AuthContext.Provider value={{user, setUser}}>
    {children}
    </AuthContext.Provider>)
};

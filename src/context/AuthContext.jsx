// import { createContext, useContext, useEffect, useState } from "react";
// import PropTypes from 'prop-types';  // Thêm dòng này để import PropTypes

// const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//     const [token, setToken] = useState(null);
//     const [userData, setUserData] = useState(null);
//     const [isAuthenticated, setIsAuthenticated] = useState(false);

//     useEffect(() => {
//         const storeData = JSON.parse(localStorage.getItem('user_data'));
//         if (storeData) {
//             const { userToken, user } = storeData;
//             setToken(userToken);
//             setUserData(user);
//             setIsAuthenticated(true);
//         }
//     }, []);

//     const login = (newToken, newData) => {
//         localStorage.setItem(
//             'user_data', 
//             JSON.stringify({ userToken: newToken, user: newData })
//         );
//         setToken(newToken);
//         setUserData(newData);
//         setIsAuthenticated(true);
//     };

//     const logout = () => {
//         localStorage.removeItem('user_data');
//         setToken(null);
//         setUserData(null);
//         setIsAuthenticated(false);
//     };

//     return (
//         <AuthContext.Provider value={{ token, isAuthenticated, login, logout, userData }}>
//             {children}
//         </AuthContext.Provider>
//     );
// };

// AuthProvider.propTypes = {
//     children: PropTypes.node.isRequired  // Thêm dòng này để xác thực children
// };

// export const useAuth = () => useContext(AuthContext);



// context/AuthContext.js
import { createContext, useContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [userData, setUserData] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem('user_data'));
    if (storedData) {
      const { userToken, user } = storedData;
      setToken(userToken);
      setUserData(user);
      setIsAuthenticated(true);
    }
  }, []);

  const login = (newToken, newUserData) => {
    localStorage.setItem(
      'user_data', 
      JSON.stringify({ userToken: newToken, user: newUserData })
    );
    setToken(newToken);
    setUserData(newUserData);
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem('user_data');
    setToken(null);
    setUserData(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ token, isAuthenticated, userData, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useAuth = () => useContext(AuthContext);


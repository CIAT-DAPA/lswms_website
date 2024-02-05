import React, { useState, useEffect, useRef, useContext } from "react";
import Keycloak from "keycloak-js";
import Configuration from "../conf/Configuration";

// Create a new context
const AuthContext = React.createContext();

// Create a provider component to wrap your app and provide the context values
export const AuthProvider = ({ children }) => {
  const [userInfo, setUserInfo] = useState(null);
  const isRun = useRef(false);
  const keycloak = useRef(null);

  useEffect(() => {
    if (isRun.current) return;
    isRun.current = true;

    keycloak.current = new Keycloak({
      url: Configuration.get_url_auth(),
      realm: Configuration.get_keycloak_realm(),
      clientId: Configuration.get_keycloak_client(),
    });

    keycloak.current
      .init({ onLoad: "check-sso" })
      .then((authenticated) => {
        if (authenticated) {
          keycloak.current.loadUserInfo().then((userInfo) => {
            setUserInfo(userInfo);
          });
        }
      })
      .catch((error) => {
        console.error("Error inicializando Keycloak:", error);
      });
  }, []);

  const login = () => {
    keycloak.current.login();
  };

  const logout = () => {
    keycloak.current.logout({ redirectUri: window.location.origin });
    setUserInfo(null);
  };

  // Provide the context values to the components
  const contextValue = {
    userInfo,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

// Custom hook to access the AuthContext
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

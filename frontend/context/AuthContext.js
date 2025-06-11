import { createContext, useContext, useEffect, useState } from "react";
import AuthServices from "../services/AuthServices";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkAuthentication = async () => {
            const authStatus = await AuthServices.isAuthenticated();
            console.log("Authentication status:", authStatus);
            setIsAuthenticated(authStatus);
            setLoading(false);
        };
        checkAuthentication();
    }, []);

    const login = async (username, password) => {
        const response = await AuthServices.login(username, password);
        if (response.success) {
            setIsAuthenticated(true);
        }
        return response;
    };

    const logout = async () => {
        const response = await AuthServices.logout();
        if (response.success) {
            setIsAuthenticated(false);
        }
        return response;
    };

    const register = async (username, password) => {
        const response = await AuthServices.register(username, password);
        return response;
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, loading, login, logout, register }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);
import { createContext, useContext, useEffect, useState } from "react";
import { authenticate, getJwtToken } from "./api/Authentication";
import axios from "axios";
import { apiClient } from "./api/ApiClient";

export const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext)

export default function AuthProvider({children}) {

    const [isAuthenticated, setAuthenticated] = useState(false)

    const [username, setUsername] = useState(null)

    const [token, setToken] = useState(null)

    const [interceptorId, setInterceptorId] = useState(undefined);

    async function login(user, pwd) {
        const userToken = "Basic " + btoa(user + ":" + pwd);
        try {
            const jwtResult = await getJwtToken(userToken);
            console.log(jwtResult.data);
            const result = await authenticate(userToken);
            if (result.status == 200) {
                setAuthenticated(true);
                setToken(userToken);
                setUsername(user);
                addAuthInterceptor(userToken);
                return true;
            } else {
                return false
            }
        } catch {
            logout()
            return false;
        }
    }

    function logout() {
        setAuthenticated(false);
        setToken(null);
        setUsername(null);
        removeAuthInterceptor();
    }

    function addAuthInterceptor(userToken) {
        removeAuthInterceptor();
        setInterceptorId(
            apiClient.interceptors.request.use((config) => {
            config.headers['Authorization'] = userToken;
            return config;
        })
        );
    }

    function removeAuthInterceptor() {
        if (interceptorId !== undefined) {
            apiClient.interceptors.request.eject(interceptorId);
            setInterceptorId(undefined);
        }
    }

    return (
        <AuthContext.Provider value={{isAuthenticated, username, token, login, logout}}>
            {children}
        </AuthContext.Provider>
    )

}


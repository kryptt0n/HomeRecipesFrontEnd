import { createContext, useContext, useEffect, useState } from "react";
import { authenticate } from "./api/Authentication";
import axios from "axios";
import { apiClient } from "./api/ApiClient";

export const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext)

export default function AuthProvider({children}) {

    const [isAuthenticated, setAuthenticated] = useState(false)

    const [username, setUsername] = useState(null)

    const [token, setToken] = useState(null)

    async function login(username, password) {
        const userToken = "Basic " + btoa(username + ":" + password);
        console.log(userToken);
        const result = await authenticate(userToken);
        console.log(result)
        if (result.status == 200) {
            setAuthenticated(true)
            setToken(userToken)
            apiClient.interceptors.request.use((config) => {
                console.log(token)
              
                config.headers['Authorization'] = userToken;
                console.log(config.headers);
              
              return config;
            });
            console.log({isAuthenticated, token});
            return true;
        } else {
            return false
        }
    }

    function logout() {
        setAuthenticated(false)
        setToken(null)
    }

    return (
        <AuthContext.Provider value={{isAuthenticated, username, token, login}}>
            {children}
        </AuthContext.Provider>
    )

}


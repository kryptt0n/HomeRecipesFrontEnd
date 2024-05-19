import { createContext, useContext, useState } from "react";
import { authenticate } from "./api/Authentication";

export const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext)

export default function AuthProvider({children}) {

    const [isAuthenticated, setAuthenticated] = useState(false)

    const [username, setUsername] = useState(null)

    const [token, setToken] = useState(null)

    function login(username, password) {
        const token = "Basic " + btoa(username + ":" + password);
        console.log(token);
        authenticate(token)
        .then((value) => {
            console.log(value);
        })
        .catch((error) => {
            console.log(error);
        })
    }

    return (
        <AuthContext.Provider value={{isAuthenticated, username, token, login}}>
            {children}
        </AuthContext.Provider>
    )

}


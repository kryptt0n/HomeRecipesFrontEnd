import { useState } from "react"
import { useAuth } from "./AuthContext";
import { useNavigate } from "react-router-dom";



export default function Login() {
    
    const [password, setPassword] = useState("");
    const [username, setUsername] = useState("user");
    const [showSuccessMesage, setSuccessMesage] = useState(false);
    const [showErrorMesage, setErrorMesage] = useState(false);
    const authContext = useAuth();
    const navigate = useNavigate();

    function onPasswordChange(event) {
        setPassword(event.target.value);
    }

    function onUsernameChange(event) {
        setUsername(event.target.value);
    }

    async function handleSubmit(event) {
        const successfulLogin = await authContext.login(username, password);
        const token = authContext.token;
        console.log(token);
        if (successfulLogin) {
            setSuccessMesage(true);
            console.log(authContext)
            navigate("/recipes")
        } else {
            setErrorMesage(true);
        }
    }

    return (
        <div className="Login">
        {showSuccessMesage && <div className='successMessage'>Login successful!</div>}
        {showErrorMesage && <div className='errorMessage'>Login failed. Check credentials</div>}
        <div className="LoginForm">
            <div>
                <label>User name</label>
                <input type="text" name="username" value={username} onChange={onUsernameChange}></input>
            </div>
            <div>
                <label>Password</label>
                <input type="password" name="password" value={password} onChange={onPasswordChange}></input>
            </div>
            <div>
                <button type="button" name="login" onClick={handleSubmit}>Login</button>
            </div>
        </div>
    </div>
    )
}
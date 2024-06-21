import { useState } from "react"
import { useAuth } from "./AuthContext";
import { useNavigate } from "react-router-dom";



export default function Login() {
    
    const [password, setPassword] = useState("testtest");
    const [username, setUsername] = useState("test10");
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
        console.log(successfulLogin);
        if (successfulLogin) {
            setSuccessMesage(true);
            console.log(authContext)
            navigate("/recipes")
        } else {
            setErrorMesage(true);
        }
    }

    return (
        <div className="container">
            {showSuccessMesage && <div className="alert alert-success">Login successful!</div>}
            {showErrorMesage && <div className="alert alert-danger">Login failed. Check credentials</div>}
            <div className="row justify-content-center">
                <div className="col-12 col-md-6 col-lg-4">
                    <div className="mb-3">
                        <label className="form-label">User name</label>
                        <input 
                            type="text" 
                            className="form-control" 
                            name="username" 
                            value={username} 
                            onChange={onUsernameChange} 
                        />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Password</label>
                        <input 
                            type="password" 
                            className="form-control" 
                            name="password" 
                            value={password} 
                            onChange={onPasswordChange} 
                        />
                    </div>
                    <div className="d-grid">
                        <button 
                            type="button" 
                            className="btn btn-primary" 
                            name="login" 
                            onClick={handleSubmit}
                        >
                            Login
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );    
}
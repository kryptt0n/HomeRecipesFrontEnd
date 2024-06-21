import { Link } from 'react-router-dom';
import { useAuth } from './AuthContext';

export default function Header() {
    const auth = useAuth();
    const isAuth = auth.isAuthenticated;

    return (
        <header className="border-bottom border-light border-5 mb-5 p-1">
            <div className="container">
                <div className="row">
                    <nav className="navbar navbar-expand-lg">
                        <a className="navbar-brand ms-2 fs-2 fw-bold text-black" href="https://www.vitalysukhinin.com">Vitaly</a>
                        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                            <span className="navbar-toggler-icon"></span>
                        </button>
                        <div className="collapse navbar-collapse" id="navbarNav">
                            <ul className="navbar-nav me-auto">
                                <li className="nav-item fs-5">
                                    <Link className="nav-link" to="/recipes">Recipes</Link>
                                </li>
                            </ul>
                            <ul className="navbar-nav">
                                <li className="nav-item fs-5">
                                    {isAuth && 
                                        <Link className="nav-link" to="/myrecipes">My recipes</Link>}
                                </li>
                                <li className="nav-item fs-5">
                                    {!isAuth && 
                                        <Link className="nav-link" to="/login">Login</Link>}
                                </li>
                                <li className="nav-item fs-5">
                                    {!isAuth && 
                                        <Link className="nav-link" to="/signup">Sign Up</Link>}
                                </li>
                                <li className="nav-item fs-5">
                                    {isAuth && 
                                        <Link className="nav-link" to="/logout">Logout</Link>}
                                </li>
                            </ul>
                        </div>
                    </nav>
                </div>
            </div>
        </header>
    );
}

// import { useContext } from 'react'
import {Link} from 'react-router-dom'
// import {AuthContext, useAuth} from './security/AuthContext'

export default function Header() {

    // const context = useAuth();
    // console.log(context);
    // console.log(context.number);
    // const isAuth = context.isAuth;
    const isAuth = true;

    return (
        <header className="border-bottom border-light border-5 mb-5 p-2">
            <div className="container">
                <div className="row">
                    <nav className="navbar navbar-expand-lg">
                        <a className="navbar-brand ms-2 fs-2 fw-bold text-black" href="https://www.vitalysukhinin.com">Vitaly</a>
                        <div className="collapse navbar-collapse">
                            <ul className="navbar-nav">
                                <li className="nav-item fs-5">
                                    {isAuth && 
                                        <Link className="nav-link" to="/welcome/vitaly">Home</Link>}
                                </li>
                                <li className="nav-item fs-5">
                                    {isAuth && 
                                        <Link className="nav-link" to="/recipes">Recipes</Link>}
                                </li>
                            </ul>
                        </div>
                        <ul className="navbar-nav">
                            <li className="nav-item fs-5">
                                {!isAuth && 
                                    <Link className="nav-link" to="/login">Login</Link>}
                            </li>
                            <li className="nav-item fs-5">
                                {isAuth && 
                                    <Link className="nav-link" to="/logout">Logout</Link>}
                            </li>
                        </ul>
                    </nav>
                </div>
            </div>
        </header>
    )
}

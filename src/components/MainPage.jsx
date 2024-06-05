import {BrowserRouter, Routes, Route, Navigate} from 'react-router-dom'
import Header from './Header'
import Error from './Error'
import ListDishes from './ListDishes'
import Login from './Login'
import AuthProvider, { useAuth } from './AuthContext'
import ListUserDishes from './ListUserDishes'
import Logout from './Logout'
import DishComponent from './DishComponent'
import SignUp from './SignUp'

function AuthenticationRoute({children}) {
    const auth = useAuth();

    if (auth.isAuthenticated)
        return children;

    return  <Navigate to="/" />
}

export default function MainPage() {   

    return (
        <AuthProvider>
            <BrowserRouter>
                <Header />
                <Routes>
                    <Route path='/' element={ <ListDishes /> } />
                    <Route path='/login' element={ <Login /> } />
                    <Route path='/recipes' element={ <ListDishes /> } />

                    <Route path='/myrecipes' element={ 
                        <AuthenticationRoute>
                            <ListUserDishes />
                        </AuthenticationRoute>
                        } />

                    <Route path='/logout' element={ 
                        <AuthenticationRoute>
                            <Logout /> 
                        </AuthenticationRoute>
                    } />
                    <Route path='/signup' element={ <SignUp /> } />

                    <Route path='/recipes/:id' element={ 
                            <DishComponent />
                    } />

                    <Route path='*' element={<Error /> } />
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    )
}
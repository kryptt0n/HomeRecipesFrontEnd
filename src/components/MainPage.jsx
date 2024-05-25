import {BrowserRouter, Routes, Route, Navigate} from 'react-router-dom'
import Header from './Header'
import Error from './Error'
import ListDishes from './ListDishes'
import Login from './Login'
import AuthProvider from './AuthContext'
import ListUserDishes from './ListUserDishes'
import Logout from './Logout'
import DishComponent from './DishComponent'

export default function MainPage() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <Header />
                <Routes>
                    <Route path='/' element={ <ListDishes /> } />
                    <Route path='/login' element={ <Login /> } />
                    <Route path='/recipes' element={ <ListDishes /> } />
                    <Route path='/myrecipes' element={ <ListUserDishes /> } />
                    <Route path='/logout' element={ <Logout /> } />
                    <Route path='/recipes/:id' element={ <DishComponent /> } />
                    <Route path='*' element={<Error /> } />
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    )
}
import { useEffect, useState } from "react"
import { retrieveDishes, retrieveImageForDish, retrieveProductsForDish } from "./api/DishesService";
import { useAuth } from "./AuthContext";
import { Navigate, useNavigate } from "react-router-dom";

export default function ListDishes() {

    const [dishes, setDishes] = useState([]);
    const auth = useAuth();
    const username = auth.username;
    const navigate = useNavigate();

    useEffect(getDishes, [username]);

    function getDishes() {
        retrieveDishes()
        .then((response) => {
            const foundDishes = response.data;
            const fetchImages = foundDishes.map(dish => {
                return retrieveImageForDish(dish.id)
                    .then(imageResponse => {
                        const imageUrl = URL.createObjectURL(imageResponse.data);
                        console.log({ ...dish, imageUrl });
                        return { ...dish, imageUrl };
                    });
            });
            return Promise.all(fetchImages);
        })
        .then(dishesWithImages => {
            setDishes(dishesWithImages);
        })
        .catch((error)=>{
            console.log(error)
            setDishes([])
        }
        )
    }

    function getProducts(id) {
        retrieveProductsForDish(id)
        .then((products) => {
            console.log(products.data)
        })
        .catch((error)=>{
            console.log(error)
        }
        )
    }

    function navigateToDishPage(id) {
        console.log(`/recipes/${id}`);
        navigate(`/recipes/${id}`);
    }

    return (
        <div className="card-group row-cols-1 row-cols-md-2 g-4">
            {dishes.map(
                dish => (
                    <div className="col">
                        <div className="card m-5 p-2 d-flex flex-row justify-content-between align-items-center">
                            <div className="card-body">
                                <h5 className="card-title">{dish.name}</h5>
                                <p className="card-text">{dish.description}</p>
                                <button className="btn btn-primary" onClick={() => navigateToDishPage(dish.id)}>Details</button>
                            </div>  
                            <img src={dish.imageUrl} className="card-img-top" alt={dish.name} width={10} height={140}/>
                        </div>
                    </div>
                ))}
        </div>
    )
}
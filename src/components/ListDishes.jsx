import { useEffect, useState } from "react"
import { retrieveDishes, retrieveProductsForDish } from "./api/DishesService";
import { useAuth } from "./AuthContext";

export default function ListDishes() {

    const [dishes, setDishes] = useState([]);
    const auth = useAuth();

    useEffect(getDishes, [dishes]);

    function getDishes() {
        retrieveDishes()
        .then((dishes) => {
            setDishes(dishes.data)
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

    return (
        <div>
            <div>
                <table className="table">
                    <thead>
                            <tr>
                                <th>Name</th>
                                <th>Cooking time</th>
                                <th>Servings</th>
                                <th>Rating</th>
                            </tr>
                    </thead>
                    <tbody>
                    {
                        dishes.map(
                            dish => (
                                <tr key={dish.id}>
                                    <td>{dish.name}</td>
                                    <td>{dish.cookingTime} min</td>
                                    <td>{dish.servings}</td>
                                    <td>{dish.rating}</td>
                                    <td> <button className="btn btn-warning" 
                                                    onClick={() => getProducts(dish.id)}>Get products</button> </td>
                                </tr>
                            )
                        )
                    }
                    </tbody>

                </table>
            </div>
        </div>
    )
}
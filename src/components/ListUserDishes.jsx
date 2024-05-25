import { useEffect, useState } from "react"
import { deleteDishApi, retrieveDishes, retrieveUserDishes } from "./api/DishesService";
import { useAuth } from "./AuthContext";
import { useNavigate } from "react-router-dom";

export default function ListUserDishes() {

    const [dishes, setDishes] = useState([]);
    const auth = useAuth();
    const username = auth.username;
    const navigate = useNavigate();

    useEffect(getDishes, [dishes]);

    function getDishes() {
        retrieveUserDishes(username)
        .then((dishes) => {
            setDishes(dishes.data)
        })
        .catch((error)=>{
            console.log(error)
            setDishes([])
        }
        )
    }

    function deleteDish(id) {
        deleteDishApi(id)
        .then((res) => {
            console.log(res);
            retrieveDishes();
        })
        .catch(error => {
            console.log(error);
        })
    }

    function updateDish(id) {
        navigate(`/recipes/${id}`)
        retrieveDishes();
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
                                    <td>{dish.cookingTime}</td>
                                    <td>{dish.servings}</td>
                                    <td>{dish.rating}</td>
                                    <td> <button className="btn btn-warning" 
                                                    onClick={() => deleteDish(dish.id)}>Delete</button> </td>
                                    <td> <button className="btn btn-success" 
                                                    onClick={() => updateDish(dish.id)}>Update</button> </td>
                                </tr>
                            )
                        )
                    }
                    </tbody>

                </table>
            </div>
            <div className="btn btn-success m-5" onClick={getDishes}>New Dish</div>
        </div>
    )
}
import { useEffect, useState } from "react"
import { deleteDishApi, retrieveDishes, retrieveRatingForDish, retrieveUserDishes } from "./api/DishesService";
import { useAuth } from "./AuthContext";
import { useNavigate } from "react-router-dom";

export default function ListUserDishes() {

    const [dishes, setDishes] = useState([]);
    const auth = useAuth();
    const username = auth.username;
    const navigate = useNavigate();

    useEffect(getDishes, [username]);

    function getDishes() {
        retrieveUserDishes(username)
        .then((dishes) => {
            let allDishes = dishes.data;
            return Promise.all(
                allDishes.map(async (dish) => {
                    const ratingResponse = await retrieveRatingForDish(dish.id);
                    dish.rating = ratingResponse.data;
                    return dish;
                })
            );
        })
        .then(allDishes => {
            console.log(allDishes);
            setDishes(allDishes);
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

    function addDish() {
        navigate(`/recipes/-1`)
        retrieveDishes();
    }

    return (
        <div>
            <div className="table-responsive">
                <table className="table table-striped">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Cooking time</th>
                            <th>Servings</th>
                            <th>Rating</th>
                            <th>Actions</th>
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
                                        <td>
                                            <div className="d-flex flex-column flex-md-row">
                                                <button 
                                                    className="btn btn-warning mb-2 mb-md-0 me-md-2" 
                                                    onClick={() => deleteDish(dish.id)}
                                                >
                                                    Delete
                                                </button>
                                                <button 
                                                    className="btn btn-success" 
                                                    onClick={() => updateDish(dish.id)}
                                                >
                                                    Update
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                )
                            )
                        }
                    </tbody>
                </table>
            </div>
            <div className="btn btn-success" onClick={addDish}>New Dish</div>
        </div>
    );
    
}
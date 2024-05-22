import { useEffect, useState } from "react"
import { retrieveDishes, retrieveUserDishes } from "./api/DishesService";
import { useAuth } from "./AuthContext";

export default function ListUserDishes() {

    const [dishes, setDishes] = useState([]);
    const auth = useAuth();
    const username = auth.username;

    useEffect(getDishes, [dishes]);

    function getDishes() {
        retrieveUserDishes(username)
        .then((dishes) => {
            console.log(dishes.data)
            setDishes(dishes.data)
        })
        .catch((error)=>{
            console.log(error)
            setDishes([])
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
                                    <td>{dish.cookingTime}</td>
                                    <td>{dish.servings}</td>
                                    <td>{dish.rating}</td>
                                    {/* <td> <button className="btn btn-warning" 
                                                    onClick={() => deleteTodo(todo.id)}>Delete</button> </td>
                                    <td> <button className="btn btn-success" 
                                                    onClick={() => updateTodo(todo.id)}>Update</button> </td> */}
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
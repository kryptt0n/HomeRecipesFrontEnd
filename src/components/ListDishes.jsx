import { useEffect, useState } from "react"
import { retrieveDishes, retrieveProductsForDish } from "./api/DishesService";
import { useAuth } from "./AuthContext";

export default function ListDishes() {

    const [dishes, setDishes] = useState([]);
    const auth = useAuth();
    const username = auth.username;

    useEffect(getDishes, [username]);

    function getDishes() {
        retrieveDishes()
        .then((foundDishes) => {
            setDishes(foundDishes.data)
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
        <div className="card-group row-cols-1 row-cols-md-2 g-4">
            {dishes.map(
                dish => (
                    <div className="col">
                        <div className="card m-5 p-2 d-flex flex-row justify-content-between align-items-center">
                            <div className="card-body">
                                <h5 className="card-title">{dish.name}</h5>
                                <p className="card-text">Some description</p>
                                <a href="#" className="btn btn-primary">Details</a>
                            </div>
                            <img src="..." className="card-img-top" alt="Dish photo" />
                        </div>
                    </div>
                ))}
        </div>
    )

    // return (
    //     <div>
    //         <div>
    //             <table className="table">
    //                 <thead>
    //                         <tr>
    //                             <th>Name</th>
    //                             <th>Cooking time</th>
    //                             <th>Servings</th>
    //                             <th>Rating</th>
    //                         </tr>
    //                 </thead>
    //                 <tbody>
    //                 {
    //                     dishes.map(
    //                         dish => (
    //                             <tr key={dish.id}>
    //                                 <td>{dish.name}</td>
    //                                 <td>{dish.cookingTime} min</td>
    //                                 <td>{dish.servings}</td>
    //                                 <td>{dish.rating}</td>
    //                                 <td> <button className="btn btn-warning" 
    //                                                 onClick={() => getProducts(dish.id)}>Get products</button> </td>
    //                             </tr>
    //                         )
    //                     )
    //                 }
    //                 </tbody>

    //             </table>
        //     </div>
        // </div>
    // )
}
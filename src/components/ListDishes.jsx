import { useEffect, useState } from "react"
import { retrieveDishes, retrieveImageForDish, retrieveProductsForDish, retrieveRatingForDish } from "./api/DishesService";
import { useAuth } from "./AuthContext";
import { Navigate, useNavigate } from "react-router-dom";
import starImg from "../assets/rating_star11.png"

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
            if (Array.isArray(foundDishes)) {
                const fetchImages = foundDishes.map(async (dish) => {
                    try {
                        const imageResponse = await retrieveImageForDish(dish.id);
                        const ratingResponse = await retrieveRatingForDish(dish.id);
                        const imageUrl = URL.createObjectURL(imageResponse.data);
                        const rating = ratingResponse.data;
                        dish.rating = rating
                        return { ...dish, imageUrl };
                    } catch (imageError) {
                        console.error(`Error fetching image for dish ${dish.id}:`, imageError);
                        return { ...dish, imageUrl: '' }; // Return the dish with an empty imageUrl on error
                    }
                });
                return Promise.all(fetchImages);
            } else {
                throw new Error("Expected an array of dishes");
            }
        })
        .then((dishesWithImages) => {
            setDishes(dishesWithImages);
        })
        .catch((error) => {
            console.error("Error retrieving dishes:", error);
            setDishes([]);
        });
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
        <div className="container">
          <div className="row row-cols-1 row-cols-md-2 g-4">
            {dishes.map(dish => (
              <div className="col" key={dish.id}>
                <div className="card m-5 p-2">
                  <img 
                    src={dish.imageUrl} 
                    className="card-img-top responsive-image" 
                    alt={dish.name} 
                  />
                  <div className="card-body">
                    <h5 className="card-title">{dish.name}</h5>
                    <p className="card-text">{dish.description}</p>
                    <div className="d-flex flex-row justify-content-between align-items-center">
                        <button 
                        className="btn btn-primary" 
                        onClick={() => navigateToDishPage(dish.id)}
                        >
                        Details
                        </button>
                        <div className="d-flex flex-row align-items-center justify-content-center">
                            <img
                            src={starImg}
                            alt="star"
                            className="star-image"/>
                            <div className="ms-2">{dish.rating}</div>
                        </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      );
}
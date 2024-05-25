import { useEffect, useState } from "react"
import { retrieveDishById, retrieveDishes, updateDishApi } from "./api/DishesService";
import { useAuth } from "./AuthContext";
import { useParams } from "react-router-dom";
import { useFormik } from "formik";

export default function DishComponent() {

    const [dish, setDish] = useState({});
    const auth = useAuth();
    const {id} = useParams();

    useEffect(() => {retrieveDish(id)}, [dish])

    const formik = useFormik({
        initialValues: {
          name: dish.name,
          cookingTime: dish.cookingTime,
          servings: dish.servings,
        },
        onSubmit: values => {
          updateDish(values);
        },
      });

      function updateDish(dishData) {
        dishData.id = dish.id;
        dishData.rating = dish.rating;
        dishData.user = dish.user;
        console.log(dishData);
      }
   
    
    function retrieveDish(id) {
        retrieveDishById(id)
        .then(dish => {
            setDish(dish.data);
        })
        .catch(error => {
            console.log(error);
        })
    }

    return (
        <div>
            <form onSubmit={formik.handleSubmit}>
                <label htmlFor="name">Name</label>
                <input 
                id="name"
                name="name"
                type="text"
                onChange={formik.handleChange}
                value={formik.values.name} />

                <label htmlFor="name">Cooking time</label>
                <input 
                id="cookingTime"
                name="cookingTime"
                type="text"
                onChange={formik.handleChange}
                value={formik.values.cookingTime} />

                <label htmlFor="name">Servings</label>
                <input 
                id="servings"
                name="servings"
                type="text"
                onChange={formik.handleChange}
                value={formik.values.servings} />

                <button type="submit">Submit</button>
            </form>
        </div>
    )
}
import { useEffect, useState } from "react"
import { retrieveDishById, retrieveDishes, updateDishApi } from "./api/DishesService";
import { useAuth } from "./AuthContext";
import { useParams } from "react-router-dom";
import { ErrorMessage, Field, Form, Formik, useFormik } from "formik";

export default function DishComponent() {

    const [dish, setDish] = useState({});
    const auth = useAuth();
    const {id} = useParams();

    useEffect(() => {retrieveDish(id)}, [dish])

    const validate = values => {
        const errors = {};
        if (!values.name) {
            errors.name = 'Required'
        } else if (values.name.length < 2) {
            errors.name = 'Should be atleast 2 characters';
        } else if (values.name.length > 100) {
            errors.name = 'Should be maximum 100 characters';
        }

        if (!values.cookingTime) {
            errors.cookingTime = 'Required'
        } else if (parseInt(values.cookingTime)) {
            errors.cookingTime = 'Should be a number';
        }

        if (!values.servings) {
            errors.servings = 'Required'
        } else if (parseInt(values.servings)) {
            errors.servings = 'Should be a number';
        }

        return errors
    }

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
        <Formik initialValues={{
            name: dish.name,
            cookingTime: dish.cookingTime,
            servings: dish.servings,
        }}
        validate={validate}
        validateOnChange={false}
        onSubmit={(values) => updateDish(values)}
        >
            <Form>
                <div className="d-flex flex-sm-column justify-content-center align-items-center gap-2">
                    <fieldset>
                        <label htmlFor="name">Name</label>
                        <Field name="name" type="text" />
                        <ErrorMessage name="name" render={msg => <div className="text-danger">{msg}</div>}/>
                    </fieldset>

                    <fieldset>
                        <label htmlFor="cookingTime">Cooking time</label>
                        <Field name="cookingTime" type="number" />
                        <ErrorMessage name="cookingTime" render={msg => <div className="text-danger">{msg}</div>}/>
                    </fieldset>

                    <fieldset>
                        <label htmlFor="servings">Servings</label>
                        <Field name="servings" type="number" />
                        <ErrorMessage name="servings" render={msg => <div className="text-danger">{msg}</div>}/>
                    </fieldset>

                    <button type="submit">Submit</button>
                </div>
            </Form>
           
        
        </Formik>
    )
}
import { useEffect, useState } from "react"
import { addDishApi, retrieveDishById, retrieveDishes, retrieveUserByUsernameApi, updateDishApi } from "./api/DishesService";
import { useAuth } from "./AuthContext";
import { useNavigate, useParams } from "react-router-dom";
import { ErrorMessage, Field, Form, Formik, useFormik } from "formik";

export default function DishComponent() {

    const [dish, setDish] = useState({});
    const auth = useAuth();
    const username = auth.username;
    const [user, setUser] = useState({})
    const {id} = useParams();
    const navigate = useNavigate();

    useEffect(() => {retrieveDish(id)}, [dish])
    useEffect(() => {retrieveUser()}, [user])

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
        } else if (!parseInt(values.cookingTime)) {
            errors.cookingTime = 'Should be a number';
        }


        if (!values.servings) {
            errors.servings = 'Required'
        } else if (!parseInt(values.servings)) {
            errors.servings = 'Should be a number';
        }

        return errors
    }

    function updateDish(dishData) {
        dishData.rating = dish.rating;
        dishData.user = user;
        
        if (id != -1) {
            dishData.id = dish.id;
            updateDishApi(dishData)
            .then(response => {
                navigate("/myrecipes");
            })
            .catch(error => {
                console.log(error);
            })
        } else {
            addDishApi(dishData)
            .then(response => {
                navigate("/myrecipes");
            })
            .catch(error => {
                console.log(error);
            })
        }
    }
   
    function retrieveUser() {
        retrieveUserByUsernameApi(username)
        .then(response => {
            setUser(response.data);
        })
        .catch(error => {
            console.log(error);
        })
    }
    
    function retrieveDish(id) {
        if (id != -1) {
            retrieveDishById(id)
            .then(dish => {
                setDish(dish.data);
            })
            .catch(error => {
                console.log(error);
            })
        }
    }


    return (
        <Formik initialValues={{
            name: dish.name,
            cookingTime: dish.cookingTime,
            servings: dish.servings,
        }}
        enableReinitialize = {true}
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

                    <button type="submit">Save</button>
                </div>
            </Form>
           
        
        </Formik>
    )
}
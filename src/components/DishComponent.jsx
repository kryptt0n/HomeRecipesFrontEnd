import { useEffect, useState } from "react"
import { addDishApi, retrieveDishById, retrieveDishes, retrieveProductsForDish, retrieveUserByUsernameApi, updateDishApi } from "./api/DishesService";
import { useAuth } from "./AuthContext";
import { useNavigate, useParams } from "react-router-dom";
import { ErrorMessage, Field, Form, Formik, useFormik, useFormikContext } from "formik";
import { useForm } from "react-hook-form";

export default function DishComponent() {

    const [dish, setDish] = useState({});
    const [products, setProducts] = useState([]);
    const auth = useAuth();
    const username = auth.username;
    const [user, setUser] = useState({})
    const {id} = useParams();
    const navigate = useNavigate();
    const {register, handleSubmit, formState: {errors}} = useForm({defaultValues: {
        name: dish.name,
        cookingTime: dish.cookingTime,
        servings: dish.servings,
        products: products
    }});
    const onSubmit = (data) => updateDish(data)


    useEffect(() => {retrieveDish(id)}, [dish])
    useEffect(retrieveUser, [user])
    useEffect(() => {retrieveProducts(id)}, [products])

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

    function retrieveProducts(id) {
        retrieveProductsForDish(id)
        .then((products) => {
            console.log(products.data)
        })
        .catch((error)=>{
            console.log(error)
        }
        )
    }

    function addProduct(productname) {
        setProducts(products.concat(productname))
        console.log(products);
    }

    const onValid = (data) => {
        onSubmit(data);
      };

    return (
        <div className="d-flex flex-sm-column justify-content-center align-items-center gap-2">
            <form onSubmit={handleSubmit(onValid)}>
                <fieldset className="form-group row">
                    <label htmlFor="name" className="col-sm-2 col-form-label">Name</label>
                    <div class="col-sm-10">
                        <input {...register("name", {required: "Name is required"})} type="text" />
                    </div>
                    <small id="namewarning" class="form-text text-danger">{errors.name?.message}</small>
                </fieldset>

                <fieldset className="form-group row">
                    <label htmlFor="cookingTime" className="col-sm-2 col-form-label">Cooking time</label>
                    <div class="col-sm-10">
                        <input {...register("cookingTime", {required: "Cooking time is required"})} type="number" />
                    </div>
                    <small id="cookingtimewarning" class="form-text text-danger">{errors.cookingTime?.message}</small>
                </fieldset>

                <fieldset className="form-group row">
                    <label htmlFor="servings" className="col-sm-2 col-form-label">Servings</label>
                    <div class="col-sm-10">
                        <input {...register("servings", {required: "Servings are required"})} type="number" />
                    </div>
                    <small id="servingswarning" class="form-text text-danger">{errors.servings?.message}</small>
                </fieldset>

                <button type="submit">Save</button>
            </form>
        </div>
    )


    return (
        <Formik initialValues={{
            name: dish.name,
            cookingTime: dish.cookingTime,
            servings: dish.servings,
            productname: ""
        }}
        enableReinitialize = {true}
        validate={validate}
        validateOnChange={false}
        onSubmit={(values) => updateDish(values)}
        >
            {props => (
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

                    <h2>Products</h2>
                    <table>
                        <thead>
                            <tr>Name</tr>
                        </thead>
                        <tbody>
                            {
                                products.map(
                                    product => {
                                        <tr key={product.id}>
                                            <td>{product.name}</td>
                                        </tr>
                                    }
                                )
                            }
                            <tr>
                                <td>
                                    <Field name="productname" type="text" />
                                </td>
                                <td><button type="button" className="btn btn-primary" onClick={() => {addProduct(props.values.productname)}}>+</button></td>
                            </tr>
                        </tbody>
                    </table>
                </Form>
            )}
        </Formik>
    )
}
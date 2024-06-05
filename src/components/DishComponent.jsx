import { useEffect, useState } from "react";
import { addDishApi, retrieveDishById, retrieveProductsForDish, retrieveUserByUsernameApi, updateDishApi } from "./api/DishesService";
import { useAuth } from "./AuthContext";
import { useNavigate, useParams } from "react-router-dom";
import { useFieldArray, useForm } from "react-hook-form";

export default function DishComponent() {
    const [dish, setDish] = useState({});
    const [user, setUser] = useState({});
    const auth = useAuth();
    const username = auth.username;
    const { id } = useParams();
    const navigate = useNavigate();

    const { register, handleSubmit, setValue, control, formState: { errors } } = useForm({
        defaultValues: {
            name: "",
            cookingTime: "",
            servings: "",
            description: "",
            image: "",
            products: []
        }
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: "products"
    });

    useEffect(() => {
        if (id !== "-1") {
            retrieveDish(id);
            retrieveProducts(id);
        }
    }, [id]);

    useEffect(() => {
        retrieveUser();
    }, [username]);

    useEffect(() => {
        if (dish) {
            setValue("name", dish.name);
            setValue("cookingTime", dish.cookingTime);
            setValue("servings", dish.servings);
            setValue("description", dish.description);
            setValue("products", dish.products || []);
        }
    }, [dish, setValue, append]);

    function updateDish(dishData) {
        dishData.rating = dish.rating;
        dishData.user = user;
        if (id !== "-1") {
            dishData.id = dish.id;
            updateDishApi(dishData)
                .then(response => navigate("/myrecipes"))
                .catch(error => console.log(error));
        } else {
            const formData = new FormData();
            formData.append('image', dishData.image[0]);
            delete dishData.image;
            dishData.products.map(
                product => {
                    delete product.value;
                })
            console.log(dishData);
            formData.append('dish', JSON.stringify(dishData));
            addDishApi(formData)
                .then(response => {
                    console.log(response.data);
                    // navigate("/myrecipes")
                })
                .catch(error => console.log(error));
        }
    }

    function retrieveUser() {
        retrieveUserByUsernameApi(username)
            .then(response => setUser(response.data))
            .catch(error => console.log(error));
    }

    function retrieveDish(id) {
        retrieveDishById(id)
            .then(responseDish => setDish(responseDish.data))
            .catch(error => console.log(error));
    }

    function retrieveProducts(id) {
        retrieveProductsForDish(id)
            .then(response => {
                setValue("products", response.data);
            })
            .catch(error => console.log(error));
    }

    function addProduct(productName) {
        if (productName) {
            append({ name: productName });
            document.getElementById('newProductName').value = "";
        }
    }

    function removeProduct(index) {
        if (index) {
            remove(index);
        }
    }

    const onValid = (data) => {
        onSubmit(data);
    };

    const onSubmit = (data) => {
        updateDish(data);
    };

    return (
        <div className="d-flex flex-sm-column justify-content-center align-items-center gap-2">
            <form onSubmit={handleSubmit(onValid)}>
                <h3>Description</h3>
                <fieldset className="form-group row">
                    <label htmlFor="name" className="col-md-5 col-form-label">Name</label>
                    <div className="col-sm-5">
                        <input {...register("name", { required: "Name is required" })} type="text" />
                    </div>
                    <small id="namewarning" className="form-text text-danger">{errors.name?.message}</small>
                </fieldset>

                <fieldset className="form-group row">
                    <label htmlFor="cookingTime" className="col-md-5 col-form-label">Cooking time</label>
                    <div className="col-sm-5">
                        <input {...register("cookingTime", { required: "Cooking time is required" })} type="number" />
                    </div>
                    <small id="cookingtimewarning" className="form-text text-danger">{errors.cookingTime?.message}</small>
                </fieldset>

                <fieldset className="form-group row mb-5">
                    <label htmlFor="servings" className="col-md-5 col-form-label mr-9">Servings</label>
                    <div className="col-sm-5">
                        <input {...register("servings", { required: "Servings are required" })} type="number" />
                    </div>
                    <small id="servingswarning" className="form-text text-danger">{errors.servings?.message}</small>
                </fieldset>

                <fieldset className="form-group row">
                    <label htmlFor="description" className="col-md-5 col-form-label">Description</label>
                    <div className="col-sm-5">
                        <input {...register("description")} type="text" />
                    </div>
                    <small id="descriptionwarning" className="form-text text-danger">{errors.name?.message}</small>
                </fieldset>

                <fieldset className="form-group row">
                    <label htmlFor="image" className="col-md-5 col-form-label">Image</label>
                    <div className="col-sm-5">
                        <input {...register("image", {required: "Image is required"})} type="file" />
                    </div>
                    <small id="imagewarning" className="form-text text-danger">{errors.image?.message}</small>
                </fieldset>

                <h3>Products</h3>
                <ul className="list-group list-group-flush">
                    {fields.map((product, index) => (
                        <li className="list-group-item">
                            <input key={product.id} {...register((`products.${index}.value`))} value={product.name} />
                            <button type="button" className="btn btn-danger btn-sm" onClick={() => removeProduct(index)}>-</button>
                        </li>
                    ))}
                    <li className="list-group-item mb-4">
                        <input type="text" id="newProductName" />
                        <button type="button" onClick={() => addProduct(document.getElementById('newProductName').value)}>+</button>
                    </li>
                </ul>
                <button type="submit" className="btn btn-success">Save</button>
            </form>
        </div>
    );
}

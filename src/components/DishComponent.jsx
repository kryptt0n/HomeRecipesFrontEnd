import { useEffect, useState } from "react";
import { addCommentForDish, addDishApi, addRatingForDish, retrieveCommentsForDish, retrieveDishById, retrieveImageForDish, retrieveProductsForDish, retrieveRatingForDish, retrieveRatingForDishFromUser, retrieveStepsForDish, retrieveUserByUsernameApi, updateDishApi } from "./api/DishesService";
import { useAuth } from "./AuthContext";
import { useNavigate, useParams } from "react-router-dom";
import { useFieldArray, useForm } from "react-hook-form";
import "../styles/DishComponent.css"

import { ReactComponent as EmptyStar} from "../assets/empty_star.svg";
import { ReactComponent as FillStar} from "../assets/rating_star.svg";
import { Rating } from "react-simple-star-rating";
import { Comment, CommentAction, CommentActions, CommentAuthor, CommentGroup, 
    CommentMetadata, CommentText, CommentContent, Header, Form, FormTextArea, Button } from "semantic-ui-react";
import CommentSection from "./CommentsSection";

export default function DishComponent() {
    const [dish, setDish] = useState({});
    const [user, setUser] = useState({});
    const [rating, setRating] = useState(1);
    const [isOwner, setOwner] = useState(false);
    const auth = useAuth();
    const username = auth?.username;
    const isAuthenticated = auth?.isAuthenticated;
    const [isNewDish, setNewDish] = useState(true);
    const { id } = useParams();
    const navigate = useNavigate();

    const { register, handleSubmit, setValue, control, formState: { errors } } = useForm({
        defaultValues: {
            name: "",
            cookingTime: "",
            servings: "",
            description: "",
            image: "",
            products: [],
            steps: [],
            comments: []
        }
    });

    const { fields: productFields, append: appendProducts, remove: removeProducts } = useFieldArray({
        control,
        name: "products"
    });

    const { fields: stepFields, append: appendSteps, remove: removeSteps } = useFieldArray({
        control,
        name: "steps"
    });

    const { fields: commentFields, append: appendComment, remove: removeComment } = useFieldArray({
        control,
        name: "comments"
    });
    
    useEffect(() => {
        if (username) {
            retrieveUser();
        }
    }, [username]);

    useEffect(() => {
        if (id !== "-1") {
            retrieveDish(id);
            retrieveProducts(id);
            setNewDish(false);
        } else {
            setNewDish(true);
        }
    }, [id, user]);


    useEffect(() => {
        if (dish) {
            setValue("name", dish.name);
            setValue("cookingTime", dish.cookingTime);
            setValue("servings", dish.servings);
            setValue("description", dish.description);
            setValue("products", dish.products || []);
            setValue("steps", dish.steps || []);
            setRating(dish.rating);
            setOwner(username !== null && (id === "-1" || username === dish.user?.username));
            autoResize(document.getElementsByTagName("textarea")[0])
            if (dish && dish.comments && dish.comments.length > 0) {
                for (let index = 0; index < dish.comments.length; index++) {
                    const comment = dish.comments[index];
                    comment.postedDate = new Date(...comment.postedDate).toLocaleDateString();
                    console.log(comment.postedDate);
                }
            }
            setValue("comments", dish.comments || [])
        }
    }, [dish, setValue, appendProducts, appendSteps]);

    async function updateDish(dishData) {
        dishData.rating = dish.rating;
        dishData.user = user;
        console.log(dishData);
        if (id !== "-1") {
            dishData.id = dish.id;
            const formData = new FormData();
            if (dishData.image && dishData.image.length > 0) {
                formData.append('image', dishData.image[0]);
            } else {
                const oldImage = await convertBlobUrlToFile(dish.imageUrl);
                formData.append('image', oldImage);
            }
            delete dishData.image;
            dishData.products.map(
                product => {
                    delete product.value;
                });

            
            formData.append('dish', JSON.stringify(dishData));
            updateDishApi(formData)
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
            console.log(formData);
            addDishApi(formData)
                .then(response => {
                    console.log(response.data);
                    navigate("/myrecipes")
                })
                .catch(error => console.log(error));
        }
    }

    const convertBlobUrlToFile = async (blobUrl) => {
        const response = await fetch(blobUrl);
        const blob = await response.blob();
        const file = new File([blob], 'uploaded-image', { type: blob.type });
        return file;
      };

    function retrieveUser() {
        retrieveUserByUsernameApi(username)
            .then(response => setUser(response.data))
            .catch(error => console.log(error));
    }

    function retrieveComments() {
        retrieveCommentsForDish(id)
        .then(response => setValue("comments", response.data || []))
        .catch(error => console.log(error));
    }

    async function retrieveDish(id) {
        retrieveDishById(id)
            .then(responseDish => responseDish.data)
            .then(dish => {
                const fetchImage = retrieveImageForDish(id).then(foundImage => {
                    const imageUrl = URL.createObjectURL(foundImage.data);
                    return { ...dish, imageUrl };
                })
                return fetchImage;
            })
            .then(dish => {
                let fetchRating = undefined;
                if (username) {
                    fetchRating = retrieveRatingForDishFromUser(username, id).then(foundRating => {
                        const rating = foundRating.data;
                        console.log({ ...dish, rating });
                        return { ...dish, rating };
                    })
                } else {
                    fetchRating = retrieveRatingForDish(id).then(foundRating => {
                        const rating = foundRating.data;
                        return { ...dish, rating };
                    })
                }
                return fetchRating;
            })
            .then(dishWithImage => setDish(dishWithImage))
            .catch(error => console.log(error));
    }

    function changedRating(rating) {
        setRating(rating);
    }

    function sendRating() {
        console.log({user: {username: username}, dishId: Number.parseInt(id), rating: rating});
        addRatingForDish({user: {username: username}, dishId: Number.parseInt(id), rating: rating})
        .then(response => console.log(response))
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
            appendProducts({ name: productName });
            document.getElementById('newProductName').value = "";
        }
    }

    function removeProduct(index) {
        console.log(productFields);
        if (index || index === 0) {
            removeProducts(index);
            console.log(productFields)
        }
    }

    function addStep(stepDescription) {
        if (stepDescription) {
            appendSteps({ description: stepDescription});
            document.getElementById('newStepName').value = "";
        }
    }

    function removeStep(index) {
        if (index || index === 0) {
            removeSteps(index);
            stepFields.forEach((step, index) => {
                step.stepNumber = index + 1;
            })
        }
    }

    function autoResize(textarea) {
        textarea.style.height = 'auto';
        textarea.style.height = (textarea.scrollHeight) + 'px';
    }

    const onValid = (data) => {
        onSubmit(data);
    };

    const onSubmit = (data) => {
        updateDish(data);
    };

    const createComment = (data) => {
        const comment = document.getElementById("newComment").value;
        const user = isAuthenticated ? { username: username } : null
        const date = new Date();
        const postedDate = date.toISOString();
        const toDisplayDate = date.toLocaleDateString();
        const dish = {id: id}
        const newComment = {comment, user, postedDate, dish};
        addCommentForDish(newComment)
        .then( response => {
            newComment.postedDate = toDisplayDate;
            appendComment(newComment);
            document.getElementById('newComment').value = "";
        }
        )
        .catch(error => {
            console.log(error);
        })
    }

    const handleDescriptionChange = (e) => {
        setValue('description', e.target.value);
        autoResize(e.target);
    };

    return (
        <div className="d-flex flex-sm-column justify-content-center align-items-center gap-2 mb-5">
            <form onSubmit={handleSubmit(onValid)}>
                <h3>Description</h3>

                <fieldset className="form-group row">
                    <label htmlFor="name" className="col-md-2 col-form-label">Name</label>
                    <div className="col-md-10">
                        <input {...register("name", { required: "Name is required" })} 
                        type="text" 
                        className="form-control" 
                        readOnly={!isOwner}/>
                    </div>
                    <small id="namewarning" className="form-text text-danger">{errors.name?.message}</small>
                </fieldset>

                <fieldset className="form-group row">
                    <label htmlFor="cookingTime" className="col-md-2 col-form-label">Cooking time</label>
                    <div className="col-md-10">
                        <input {...register("cookingTime", { required: "Cooking time is required" })} 
                        type="number" 
                        className="form-control"
                        readOnly={!isOwner}/>
                    </div>
                    <small id="cookingtimewarning" className="form-text text-danger">{errors.cookingTime?.message}</small>
                </fieldset>

                <fieldset className="form-group row mb-1">
                    <label htmlFor="servings" className="col-md-2 col-form-label">Servings</label>
                    <div className="col-md-10">
                        <input {...register("servings", { required: "Servings are required" })} 
                        type="number" 
                        className="form-control"
                        readOnly={!isOwner}/>
                    </div>
                    <small id="servingswarning" className="form-text text-danger">{errors.servings?.message}</small>
                </fieldset>

                <fieldset className="form-group row">
                    <label htmlFor="description" className="col-md-2 col-form-label">Description</label>
                    <div className="col-md-10">
                        <textarea 
                            className="growable-textarea form-control" 
                            {...register("description")} 
                            contentEditable={isOwner} 
                            rows="1" 
                            placeholder="Description"  
                            maxLength={1500} 
                            onInput={handleDescriptionChange}
                            readOnly={!isOwner}
                            >{dish.description}
                        </textarea>
                    </div>
                </fieldset>

                <fieldset className="form-group row">
                    <label htmlFor="image" className="col-md-2 col-form-label">Image</label>
                    <div className="col-md-10">
                        {isOwner && <input {...register("image", {required: id === -1 ? "Image is required" : false})} type="file" />}
                    <img 
                    src={dish.imageUrl} 
                    className="card-img-top responsive-image" 
                    alt={dish.name} 
                  />
                    </div>
                    <small id="imagewarning" className="form-text text-danger">{errors.image?.message}</small>
                </fieldset>

                <h3>Ingredients</h3>
                <ul className="list-group list-group-flush">
                    {productFields.map((product, index) => (
                        <li className="list-group-item d-flex align-items-center justify-content-between" key={product.id}>
                            <input 
                                {...register(`products.${index}.name`)} 
                                defaultValue={product.name} 
                                className="form-control me-2 flex-grow-1"
                                readOnly={!isOwner}
                            />
                            {isOwner && <button type="button" className="btn btn-danger btn-sm" onClick={() => removeProduct(index)}>-</button>}
                        </li>
                    ))}
                    {isOwner &&
                    <li className="list-group-item d-flex align-items-center mb-4">
                        <input type="text" id="newProductName" className="form-control me-2 flex-grow-1"/>
                        <button type="button" className="btn btn-primary" onClick={() => addProduct(document.getElementById('newProductName').value)}>+</button>
                    </li>}
                </ul>

                <h3>Steps</h3>
                <ol className="list-group list-group-numbered">
                    {stepFields.map((step, index) => (
                        <li className="list-group-item d-flex align-items-center justify-content-between" key={step.stepsId}>
                            <p contentEditable={isOwner} {...register(`steps.${index}.description`)} className="flex-grow-1 me-2 mb-0">{step.description}</p>
                            {isOwner && <button type="button" className="btn btn-danger btn-sm" onClick={() => removeStep(index)}>-</button>}
                        </li>
                    ))}
                    {isOwner &&
                    <li className="list-group-item d-flex align-items-center mb-4">
                        <input type="text" id="newStepName" className="form-control me-2 flex-grow-1"/>
                        <button type="button" className="btn btn-primary" onClick={() => addStep(document.getElementById('newStepName').value)}>+</button>
                    </li>}
                </ol>

                {isOwner && <fieldset className="form-group row">
                    <div className="col-md-12 text-center">
                        <button type="submit" className="btn btn-success">Save</button>
                    </div>
                </fieldset>}

                <CommentSection commentFields={commentFields} createComment={createComment} />
                
                {
                    !isNewDish &&
                    <h3 className="mt-3">Rating</h3> &&

                    <fieldset className="form-group row">
                        <div className="col-md-12 text-center">
                            <Rating readonly={!isAuthenticated} initialValue={rating} onClick={(val) => changedRating(val)}/>
                            {isAuthenticated && <button type="button" className="btn btn-warning" onClick={sendRating}>Rate</button>}
                        </div>
                    </fieldset>
                }
            </form>
        </div>
    );
}

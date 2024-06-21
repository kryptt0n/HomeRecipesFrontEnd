import { useEffect, useState } from "react"
import { addDishApi, retrieveDishById, retrieveDishes, retrieveUserByUsernameApi, updateDishApi } from "./api/DishesService";
import { useAuth } from "./AuthContext";
import { useNavigate, useParams } from "react-router-dom";
import { ErrorMessage, Field, Form, Formik, useFormik } from "formik";
import { createUserApi, encodeSHA256 } from "./api/Authentication";

export default function SignUp() {

    const auth = useAuth();
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");

    const validate = values => {
        const errors = {};
        if (!values.username) {
            errors.username = 'Required'
        } else if (values.username.length < 2) {
            errors.username = 'Should be atleast 2 characters';
        } else if (values.username.length > 45) {
            errors.username = 'Should be maximum 45 characters';
        }

        if (!values.email) {
            errors.email = 'Required'
        } else if (!(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(values.email))) {
            errors.email = 'Should be an email';
        }


        if (!values.password) {
            errors.password = 'Required'
        } else if (values.password.length < 8) {
            errors.password = 'Should be atleast 8 characters';
        }

        return errors
    }

    async function signUpUser(credentials) {
        credentials.password = await encodeSHA256(credentials.password);
        credentials.enabled = true;
        createUserApi(credentials)
        .then(response => {
            console.log(response);
            navigate("/login");
        })
        .catch(error => {
            console.log(error);
        })
        
    }


    return (
        <Formik
            initialValues={{
                username: "",
                password: "",
                email: ""
            }}
            validate={validate}
            validateOnChange={false}
            onSubmit={(credentials) => signUpUser(credentials)}
        >
            <Form>
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-12 col-md-6 col-lg-4">
                            <fieldset className="mb-3">
                                <label htmlFor="username" className="form-label">Username</label>
                                <Field name="username" type="text" className="form-control" />
                                <ErrorMessage name="username" render={msg => <div className="text-danger">{msg}</div>} />
                            </fieldset>
    
                            <fieldset className="mb-3">
                                <label htmlFor="password" className="form-label">Password</label>
                                <Field name="password" type="password" className="form-control" />
                                <ErrorMessage name="password" render={msg => <div className="text-danger">{msg}</div>} />
                            </fieldset>
    
                            <fieldset className="mb-3">
                                <label htmlFor="email" className="form-label">Email</label>
                                <Field name="email" type="email" className="form-control" />
                                <ErrorMessage name="email" render={msg => <div className="text-danger">{msg}</div>} />
                            </fieldset>
    
                            <div className="d-grid">
                                <button type="submit" className="btn btn-primary">Sign up</button>
                            </div>
                        </div>
                    </div>
                </div>
            </Form>
        </Formik>
    );
    
}
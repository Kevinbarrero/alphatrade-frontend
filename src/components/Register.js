import React, {useState, useRef} from "react";
import {useDispatch, useSelector} from "react-redux";

import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import CheckButton from "react-validation/build/button";
import {isEmail} from "validator";
import {useNavigate} from 'react-router-dom';


import {register} from "../actions/auth";

const required = (value) => {
    if (!value) {
        return (
            <div className="alert alert-danger" role="alert">
                This field is required!
            </div>
        );
    }
};

const validEmail = (value) => {
    if (!isEmail(value)) {
        return (
            <div className="alert alert-danger" role="alert">
                This is not a valid email.
            </div>
        );
    }
};

const vfirstname = (value) => {
    if (value.length < 3 || value.length > 20) {
        return (
            <div className="alert alert-danger" role="alert">
                The username must be between 3 and 20 characters.
            </div>
        );
    }
};

const vpassword = (value) => {
    if (value.length < 6 || value.length > 40) {
        return (
            <div className="alert alert-danger" role="alert">
                The password must be between 6 and 40 characters.
            </div>
        );
    }
};

const Register = () => {
    let navigate = useNavigate();
    const form = useRef();
    const checkBtn = useRef();

    const [firstname, setFirstname] = useState("");
    const [lastname, setLastname] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [successful, setSuccessful] = useState(false);

    const {message} = useSelector(state => state.message);
    const dispatch = useDispatch();

    const onChangeFirstname = (e) => {
        const firstname = e.target.value;
        setFirstname(firstname);
    };

    const onChangeLastname = (e) => {
        const lastname = e.target.value;
        setLastname(lastname);
    }

    const onChangeEmail = (e) => {
        const email = e.target.value;
        setEmail(email);
    };

    const onChangePassword = (e) => {
        const password = e.target.value;
        setPassword(password);
    };

    const handleRegister = (e) => {
        e.preventDefault();

        setSuccessful(false);

        form.current.validateAll();

        if (checkBtn.current.context._errors.length === 0) {
            dispatch(register(firstname, lastname, email, password))
                .then(() => {
                    setSuccessful(true);
                    navigate("/login");
                    window.location.reload();
                })
                .catch(() => {
                    setSuccessful(false);
                });
        }
    };

    return (
        <div className="row login">
            <div className="container">
                <div className="row flex-sm-nowrap align-items-center">
                    <div className="col-6 login-image-block">
                        <img
                            src="../images/login_image.png"
                            alt="login-img"
                            className="login-img-card"
                        />
                    </div>
                    <div className="col-6 login-form-block">
                        <div className="card card-container">
                          <p id="welcome">Create your account</p>
                            <Form onSubmit={handleRegister} ref={form} className="sign-up-form">
                                {!successful && (
                                    <div>
                                        <div className="form-group">
                                            <Input
                                                id="name-input"
                                                type="text"
                                                className="form-control"
                                                name="firstname"
                                                placeholder="Firstname"
                                                value={firstname}
                                                onChange={onChangeFirstname}
                                                validations={[required, vfirstname]}
                                            />
                                        </div>

                                        <div className="form-group">
                                            <Input
                                                id="name-input"
                                                type="text"
                                                className="form-control"
                                                name="lastname"
                                                placeholder="Lastname"
                                                value={lastname}
                                                onChange={onChangeLastname}
                                                validations={[required, vfirstname]}
                                            />
                                        </div>


                                        <div className="form-group">
                                            <Input
                                                id="email-input"
                                                type="text"
                                                className="form-control"
                                                name="email"
                                                placeholder="Email"
                                                value={email}
                                                onChange={onChangeEmail}
                                                validations={[required, validEmail]}
                                            />
                                        </div>

                                        <div className="form-group">
                                            <Input
                                                id="password-input"
                                                type="password"
                                                className="form-control"
                                                name="password"
                                                placeholder="Password"
                                                value={password}
                                                onChange={onChangePassword}
                                                validations={[required, vpassword]}
                                            />
                                        </div>
                                        <p id="already-has-account">Don’t you have account, click here.</p>
                                        <div className="form-group" id="btn-login">
                                            <button className="btn btn-primary btn-block btn-gradient">Sign Up</button>
                                        </div>
                                    </div>
                                )}

                                {message && (
                                    <div className="form-group">
                                        <div className={successful ? "alert alert-success" : "alert alert-danger"}
                                             role="alert">
                                            {message}
                                        </div>
                                    </div>
                                )}
                                <CheckButton style={{display: "none"}} ref={checkBtn}/>
                            </Form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;

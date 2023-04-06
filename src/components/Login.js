import React, {useState, useRef} from "react";
import {useDispatch, useSelector} from "react-redux";
import {Navigate, useNavigate} from 'react-router-dom';

import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import CheckButton from "react-validation/build/button";

import {login} from "../actions/auth";

const required = (value) => {
    if (!value) {
        return (
            <div className="alert alert-danger" role="alert">
                This field is required!
            </div>
        );
    }
};

const Login = (props) => {
    let navigate = useNavigate();

    const form = useRef();
    const checkBtn = useRef();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const {isLoggedIn} = useSelector(state => state.auth);
    const {message} = useSelector(state => state.message);

    const dispatch = useDispatch();

    const onChangeEmail = (e) => {
        const username = e.target.value;
        setEmail(username);
    };

    const onChangePassword = (e) => {
        const password = e.target.value;
        setPassword(password);
    };

    const handleLogin = (e) => {
        e.preventDefault();

        setLoading(true);

        form.current.validateAll();

        if (checkBtn.current.context._errors.length === 0) {
            dispatch(login(email, password))
                .then(() => {
                    navigate("/profile");
                    window.location.reload();
                })
                .catch(() => {
                    setLoading(false);
                });
        } else {
            setLoading(false);
        }
    };

    if (isLoggedIn) {
        return <Navigate to="/profile"/>;
    }

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
                            <p id="welcome">Welcome to AlphaTrade</p>
                            <Form onSubmit={handleLogin} ref={form} className="login-form">
                                <div className="form-group">
                                    <Input
                                        id="email-input"
                                        type="text"
                                        className="form-control"
                                        name="email"
                                        placeholder="Email"
                                        value={email}
                                        onChange={onChangeEmail}
                                        validations={[required]}
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
                                        validations={[required]}
                                    />
                                </div>
                                <p id="already-has-account">If You don’t have account, click here.</p>
                                <div className="form-group" id="btn-login">
                                    <button className="btn btn-primary btn-block btn-gradient" disabled={loading}>
                                        {loading && (
                                            <span className="spinner-border spinner-border-sm"></span>
                                        )}
                                        <span>Login</span>
                                    </button>
                                </div>

                                {message && (
                                    <div className="form-group">
                                        <div className="alert alert-danger" role="alert">
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

export default Login;

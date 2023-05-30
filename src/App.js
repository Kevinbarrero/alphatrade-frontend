import React, { useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Routes, Route, Link, useLocation } from "react-router-dom";

import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

import Login from "./components/Login";
import Register from "./components/Register";
import Home from "./components/Home";
import Profile from "./components/Profile";
import Strategies from "./components/Strategies";
import Market from "./components/Market";

import { logout } from "./actions/auth";
import { clearMessage } from "./actions/message";
import {Button, ButtonGroup} from "react-bootstrap";
import {useTheme} from "./useTheme";


const App = () => {
  const { user: currentUser } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  let location = useLocation();

  const { theme, setTheme } = useTheme()

  const handleLightThemeClick = () => {
    setTheme('light')
  }
  const handleDarkThemeClick = () => {
    setTheme('dark')
  }
  useEffect(() => {
    if (["/login", "/register"].includes(location.pathname)) {
      dispatch(clearMessage());
    }
  }, [dispatch, location]);

  const logOut = useCallback(() => {
    //console.log('navbar: ', localStorage.getItem('user'))
    dispatch(logout());
  }, [dispatch]);
  return (
    <div>
      <nav className="navbar navbar-expand">
        <Link to={"/"} className="navbar-brand" id="logo-text">
          AlphaTrade
        </Link>
        <ButtonGroup className="theme-btn" aria-label="Theme toggle">
          <Button className="light" variant="secondary" onClick={handleLightThemeClick}>
            Light
          </Button>
          <Button className="dark" variant="secondary" onClick={handleDarkThemeClick}>
            Dark
          </Button>
        </ButtonGroup>
        <div className="navbar-nav mr-auto nav-links">
          {currentUser && (
            <>
              <li className="nav-item">
                <Link to={"/profile"} className="nav-link">
                  Profile
                </Link>
              </li>
              <li className="nav-item">
                <Link to={"/market"} className="nav-link">
                  Market
                </Link>
              </li>
              <li className="nav-item">
                <Link to={"/strategies"} className="nav-link">
                  Strategies
                </Link>
              </li>
            </>
          )}
        </div>
        {currentUser ? (
          <div className="navbar-nav ml-auto">
            <li className="nav-item">
              <div className="form-group" id="btn-logout">
                <a href="/login" className="btn btn-primary btn-block btn-gradient-2" id="mainPage-learn-more-btn" onClick={logOut}>Log Out</a>
              </div>
            </li>
          </div>
        ) : (
          <div className="navbar-nav ml-auto">
            <li className="form-group" id="btn-login-main">
              <Link to={"/login"} className="btn btn-primary btn-block btn-gradient">
                Login
              </Link>
            </li>

            <li className="form-group" id="btn-sign-up-main">
              <Link to={"/register"} className="btn btn-primary btn-block btn-gradient-2">
                Sign Up
              </Link>

            </li>
          </div>
        )}
      </nav>

      <div>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/strategies" element={<Strategies />} />
          <Route path="/market" element={<Market />} />
        </Routes>
      </div>
    </div>
  );
};

export default App;

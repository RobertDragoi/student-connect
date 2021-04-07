import React, { useReducer } from "react";
import UserContext from "./userContext";
import UserReducer from "./userReducer";
import axios from "axios";
import {
  REGISTER_SUCCES,
  REGISTER_FAIL,
  LOGIN_SUCCES,
  LOGIN_FAIL,
  CLEAR_ERRORS,
  USER_LOADED,
  LOGOUT,
} from "../../types";
const UserState = (props) => {
  const initialState = {
    token: localStorage.getItem("Authorization"),
    isAuthenticated: false,
    user: null,
    error: null,
  };
  const [state, dispatch] = useReducer(UserReducer, initialState);
  const Register = async (formData) => {
    try {
      const res = await axios.post("http://localhost:3003/api/users", formData);
      dispatch({ type: REGISTER_SUCCES, payload: res.data.token });
      localStorage.setItem("Authorization", res.data.token);
      LoadUser();
      console.log("inregistrare");
    } catch (error) {
      dispatch({ type: REGISTER_FAIL, payload: error.error });
    }
  };
  const Login = async (formData) => {
    try {
      const res = await axios.post("http://localhost:3003/api/login", formData);
      dispatch({ type: LOGIN_SUCCES, payload: res.data.token });
      localStorage.setItem("Authorization", res.data.token);
      LoadUser();
      console.log("logare");
    } catch (error) {
      dispatch({ type: LOGIN_FAIL, payload: error.error });
    }
  };
  const Logout = () => {
    delete axios.defaults.headers.common["Authorization"];
    localStorage.removeItem("Authorization");
    try {
      dispatch({ type: LOGOUT });
      console.log("delogare");
    } catch (error) {
      dispatch({ type: LOGIN_FAIL, payload: error.error });
    }
  };
  const LoadUser = async () => {
    if (localStorage.Authorization) {
      setAuthToken(localStorage.Authorization);
    }
    try {
      const res = await axios.get("http://localhost:3003/api/login");
      dispatch({ type: USER_LOADED, payload: res.data });
    } catch (error) {
      dispatch({ type: LOGIN_FAIL, payload: error.error });
    }
  };

  const setAuthToken = (token) => {
    if (token) {
      axios.defaults.headers.common["Authorization"] = token;
    } else {
      delete axios.defaults.headers.common["Authorization"];
    }
  };
  return (
    <UserContext.Provider
      value={{
        user: state.user,
        error: state.error,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
        Register,
        Login,
        Logout,
      }}
    >
      {props.children}
    </UserContext.Provider>
  );
};

export default UserState;

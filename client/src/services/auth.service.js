import axios from "axios";

const API_URL = "http://localhost:8080/api/auth/";

export const register = (username, email, password) => {
    return axios.post(API_URL + "signup", {
        username,
        email,
        password,
    });
};

export const login = (identifier, password) => {
    localStorage.removeItem("user"); // Clear any existing user data
    const isEmail = identifier.includes('@');
    return axios.post(API_URL + "signin", {
        username: isEmail ? null : identifier,
        email: isEmail ? identifier : null,
        password,
    }).then((response) => {
        if (response.data.accessToken) {
            localStorage.setItem("user", JSON.stringify(response.data));
        }
        return response.data;
    });
};

export const logout = () => {
    localStorage.removeItem("user");
};

export const getCurrentUser = () => {
    return JSON.parse(localStorage.getItem("user"));
};

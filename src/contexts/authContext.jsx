import { useContext, useState, createContext } from "react";
import PropTypes from "prop-types";

const stateContext = createContext({
    user: ' ',
    token: 'null',
    setUser: () => {},
    setToken: () => {},
    logout: () => {},
});

export const AuthProvider = ({ children }) => {
    const [user, _setUser] = useState(() => {
        const storedUser = localStorage.getItem("USER_CREDS");
        return storedUser && storedUser !== "undefined" ? JSON.parse(storedUser) : '';
    });

    const setUser = (user) => {
        _setUser(user);
        if (user) {
            localStorage.setItem("USER_CREDS", JSON.stringify(user));
        } else {
            localStorage.removeItem("USER_CREDS");
        }
    };

    const [token, _setToken] = useState(() => {
        const storedToken = localStorage.getItem("ACCESS_TOKEN");
        return storedToken ? JSON.parse(storedToken) : null;
    });

    const setToken = (token) => {
        _setToken(token);
        if (token) {
            localStorage.setItem("ACCESS_TOKEN", JSON.stringify(token));
        } else {
            localStorage.removeItem("ACCESS_TOKEN");
        }
    };

    const logout = () => {
        localStorage.removeItem("USER_CREDS");
        localStorage.removeItem("ACCESS_TOKEN");
        _setUser(null);
        _setToken(null);
    };

    return (
        <stateContext.Provider value={{ user, token, setUser, setToken, logout }}>
            {children}
        </stateContext.Provider>
    );
};

AuthProvider.propTypes = {
    children: PropTypes.node.isRequired,
};

export const UseAuthContext = () => useContext(stateContext);

import { useContext, useState } from "react";
import { createContext } from "react";
import PropTypes from "prop-types";


const stateContext = createContext({

    user: {
                id: " ",
        dateJoined: " ",
        email: " ",
        handle: " ",
        profilePic: " ",
        role: "guest",
        tags: " ",
        username: " ",

    },
    token: ' ',

});

export const AuthContext = ({ children }) => {


    // localStorage.setItem('USER_CREDS',"");
    // localStorage.removeItem('USER_CREDS');
    // localStorage.removeItem('ACCESS_TOKEN');

    const [user, _setUser] = useState(() => {
        ////console.log(localStorage.getItem('USER_CREDS'))
        const storedUser = localStorage.getItem('USER_CREDS');
        // //console.log(localStorage.getItem('USER_CREDS'))
        // //console.log(storedUser === 'undefined')

        if (storedUser !== 'undefined') {
            return JSON.parse(storedUser)
        } else {
            return {
                id: " ",
                dateJoined: " ",
                email: " ",
                handle: " ",
                profilePic: " ",
                role: "guest",
                tags: " ",
                username: " ",

            }
        }

        // return storedUser != undefined ? JSON.parse(storedUser) : '';
    });

    const setUser = (user) => {
        _setUser(user)
        if (user) {
            localStorage.setItem('USER_CREDS', JSON.stringify(user));
        } else {
            localStorage.setItem('USER_CREDS', {
                id: " ",
                dateJoined: "",
                email: " ",
                handle: " ",
                profilePic: " ",
                role: "guest",
                tags: " ",
                username: " ",

            });
        }
    }


    const [token, _setToken] = useState(localStorage.getItem('ACCESS_TOKEN'));

    const setToken = (token) => {
        _setToken(token)
        if (token) {
            localStorage.setItem('ACCESS_TOKEN', JSON.stringify(token));
        } else {
            localStorage.setItem('ACCESS_TOKEN', '');
        }
    }

    function logout() {
        localStorage.removeItem('USER_CREDS');
        localStorage.removeItem('ACCESS_TOKEN');
    }

    ////console.log(user);

    // localStorage.removeItem('USER_CREDS');
    // localStorage.removeItem('ACCESS_TOKEN');


    return (

        <stateContext.Provider value={{
            user: user,
            token: token,
            setUser,
            setToken,
            logout

        }}>
            {children}
        </stateContext.Provider>

    );
};

AuthContext.propTypes = {
    children: PropTypes.node.isRequired,
}

export const UseAuthContext = () => useContext(stateContext);

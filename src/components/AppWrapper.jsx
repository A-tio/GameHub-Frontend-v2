import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import '../styles/AppWrapper.css';
import { useState, useEffect } from "react";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import Logout from '@mui/icons-material/Logout';
import Login from '@mui/icons-material/Login';

import { UseAuthContext } from "../contexts/authContext";

import { useAlertContext } from "../contexts/alertContext";
import NotifToast from "./notifToast";
import Search from "../assets/images/search_icon.svg";
import Logo from '../assets/images/logo-colored.svg';
import BannedScreen from "./bannedScreen";
import SuspendedScreen from "./suspendedScreen";
import { useSearchContext } from "../contexts/searchContext";
import { laraveLOG, getEntryById } from "../firebaseOperations";

const AppWrapper = ({ children }) => {
    const [activeItem, setActiveItem] = useState("discussions");
    const { user, logout } = UseAuthContext();
    //console.log(user);
    const navigate = useNavigate();
    const alert = useAlertContext();
    const [suspension, setSuspension] = useState();
    const [banned, setBan] = useState(false);
    const [role, setRole] = useState("guest");
    const suspensionDate = suspension ? new Date(suspension) : null;
    const { searchText, setSearchText } = useSearchContext();
    const [searchTerm, setSearchTerm] = useState(searchText);

    const handleInputChange = (e) => {
        setSearchTerm(e.target.value); // Update state with the current input value
    };
    //console.log(user);
    function timeLeft() {
        const now = new Date();

        const diffInSeconds = Math.floor((suspensionDate - now) / 1000);

        const intervals = [
            { label: 'second', seconds: 1 },
            { label: 'minute', seconds: 60 },
            { label: 'hour', seconds: 3600 },
            { label: 'day', seconds: 86400 },
            { label: 'month', seconds: 2592000 },
            { label: 'year', seconds: 31536000 }
        ];

        for (let i = intervals.length - 1; i >= 0; i--) {
            const interval = intervals[i];
            const intervalValue = Math.floor(diffInSeconds / interval.seconds);

            if (intervalValue > 0) {
                return `Suspended for ${intervalValue}+ ${interval.label}${intervalValue > 1 ? 's' : ''}`;
            }
        }

        return '';  // For cases like 0 seconds difference
    }


    const handleSignOut = async () => {
        try {
            logout();
            navigate('/home');
            alert.success('Signed out!');
        } catch (error) {
            console.error("Error signing out:", error.message);
        }
    };


    useEffect(() => {

        ////console.log(user);
        user && setRole(
            user.role
        )

        return;
    }, [user])


    useEffect(() => {

        ////console.log(searchTerm);
        return;
    }, [searchTerm])

    useEffect(() => {
        if (!user || !user.id || user.id === " ") {
            setSuspension(undefined);
            setBan(false);
            return;
        }

        let mounted = true;

        const fetchUser = async () => {
            try {
                const details = await getEntryById('users', user.id);
                if (!mounted) return;
                setSuspension(details?.suspension ?? null);
                setBan(details?.banned ?? false);
            } catch (error) {
                console.error(error);
            }
        };

        fetchUser();

        return () => {
            mounted = false;
        };
    }, [user]);


    // ////console.log(banned)
    // ////console.log(suspensionDate)
    return (
        <div className="app-wrapper-main">

            {banned ? <BannedScreen /> : <></>}
            {timeLeft() != '' ? <SuspendedScreen suspendedTime={timeLeft()} suspendedDate={`${suspensionDate?.toLocaleDateString?.() ?? ''} ${suspensionDate?.toLocaleTimeString?.() ?? ''}`} /> : <></>}



            <header>
                <div className="logo-box">
                    <a href="/Home">   <img className="home-logo" src={Logo} /></a>
                  
                    <h2>GameHub</h2>
                </div>
                <div className="searchbar">
                    <input type="text" name="" id="searchBar" placeholder="Search"

                        value={searchTerm}
                        onChange={handleInputChange}
                    />
                    <img onClick={() => {
            laraveLOG(`User ID ${user ? `(@${user.handle})${user.id}` : "guest"} has searched using the searchterm: ${searchTerm}`);
            setSearchText(searchTerm);
                    }} className="AppIcon" src={Search} />
                </div>
                <div>
                    <div className="list-container">
                        <ul className="navlist">

                            {user ? <li className="navLink" onClick={() => { navigate(`/profile?userId=${user.id}`) }}> <AccountCircleIcon className="AppIcon" /><p>{user.username}</p> </li>
                                :
                                <li className="navLink" onClick={() => { navigate("/login") }}> <Login className="AppIcon" /><p>Login</p> </li>

                            }

                        </ul>
                    </div>

                </div>
            </header>


            <div className="vertical-navbar ">
                <ul className="vert-navlist">

                    {user && (role == 'admin' ? (
                        <li

                            className={`navLink ${activeItem === "admin" ? "active" : ""}`}
                            onClick={() => {
                                setActiveItem("admin");
                                navigate("/dashboard/Admin/Panel");
                            }}
                        >
                            <div className={`navItem ${activeItem === "admin" ? "active" : ""}`}>
                                <div className="side-color" />
                                <div className="navLink">
                                    <span className={`material-symbols-outlined ${activeItem === "admin" ? "filled" : ""}`}>
                                        admin_panel_settings
                                    </span>
                                    <p>Admin Panel</p>
                                </div>
                            </div>
                        </li>
                    ) : "")}
                    <li
                        className={`navLink ${activeItem === "discussions" ? "active" : ""}`}
                        onClick={() => {
                            setActiveItem("discussions");
                            navigate("/Home");
                        }}
                    >
                        <div className={`navItem ${activeItem === "discussions" ? "active" : ""}`}>
                            <div className="side-color" />
                            <div className="navLink">
                                <span className={`material-symbols-outlined ${activeItem === "discussions" ? "filled" : ""}`}>
                                    chat_bubble
                                </span>
                                <p>Discussions</p>
                            </div>
                        </div>
                    </li>
                    {/* <li
                        className={`navLink ${activeItem === "explore" ? "active" : ""}`}
                        onClick={() => {
                            setActiveItem("explore");
                        }}
                    >
                        <div className={`navItem ${activeItem === "explore" ? "active" : ""}`}>
                        <div className="side-color"/>
                            <div className="navLink">
                            <span className={`material-symbols-outlined ${activeItem === "explore" ? "filled" : ""}`}>
                                    explore
                                </span>
                                <p>Explore</p>
                            </div>
                        </div>
                    </li> */}
                    <li
                        className={`navLink ${activeItem === "about" ? "active" : ""}`}
                        onClick={() => {
                            setActiveItem("about");
                            navigate("/about");
                        }}
                    >
                        <div className={`navItem ${activeItem === "about" ? "active" : ""}`}>
                            <div className="side-color" />
                            <div className="navLink">
                                <span className={`material-symbols-outlined ${activeItem === "about" ? "filled" : ""}`}>
                                    info
                                </span>
                                <p>About</p>
                            </div>
                        </div>
                    </li>

                </ul>

                {user &&

                    (user == "" ? "" : <button className="logout-btn" onClick={() => { handleSignOut() }}>
                        <div className="navItem logout-container">
                            <div className="logout-container">
                                <Logout className="AppIcon" />
                                <p>Logout</p>
                            </div>
                        </div>
                    </button>
                    )

                }
            </div>

            <main>


                <div className="content-page" > {children} </div>

                {/* <NotifComponent type={notif.type} message={notif.message} />    */}

            </main>
            <NotifToast />

        </div>
    );
}

AppWrapper.propTypes = {
    children: PropTypes.node.isRequired
}


export default AppWrapper;
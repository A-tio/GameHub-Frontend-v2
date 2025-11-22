// import "../styles/loginRegister.css";
import Close from "@mui/icons-material/Close";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRef } from "react";
import LoadingScreen from "./loadingScreen";

import TextField from "@mui/material/TextField";

import { addEntryWithId, getEntryById, laraveLOG } from "../firebaseOperations";
import { UseAuthContext } from "../contexts/authContext";
import Logo from "../assets/images/logo-colored.svg";
import { useAlertContext } from "../contexts/alertContext";

function RegisterLoginBox(props) {
  // const { setUser } = UseAuthContext();
  const { user, setUser, setToken } = UseAuthContext();
  const [registerMode, setRegisterMode] = useState(props.register);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const emailRef = useRef();
  const pWordRef = useRef();
  const cWordRef = useRef();
  const alert = useAlertContext();

  //To make sure that every error gets cleared after
  // reloading.
  useEffect(() => {
    setError("");

    return;
  }, [registerMode, loading]);

  const goBack = () => {
    navigate(-1);
  };

  const registerUser = async (email, password) => {
    setLoading(true);
    ////console.log("User registration");
    createUserWithEmailAndPassword(auth, email, password)
      .then(async (userCredential) => {
        setLoading(false);
        // Successfully registered
        const user = userCredential.user;
        ////console.log("User registered:", user.uid);
        alert.success("account created successfully!");
        try {
          setLoading(true); //Enable the loading screen
          //wait and pause for the response of the server
          await addEntryWithId("users", user.uid, {
            // email: email, password: password,
            username: "",
            handle: "",
            dateJoined: new Date().toLocaleString() + "",
            role: "user",
            tags: [],
            profilePic: "",
          });

          laraveLOG(
            "User has registered with the following details: \n " +
              JSON.stringify({
                email: email,
                password: password,
                username: "",
                handle: "",
                dateJoined: new Date().toLocaleString(),
              })
          );
        } catch (error) {
          //try catch in order to properly log the error
          //console.log(error)
          alert.error("An error occured somewhere...");
        }
        //Ends the loading scren, amd then relocates the user into log in process

        setLoading(false);

        await logInUser(email, password);
        navigate("/dashboard/createProfile");
      })
      .catch((error) => {
        // Handle errors here
        setLoading(false);
        const errorCode = error.code;
        const errorMessage = error.message;
        setError(errorMessage);
        alert.error("An error occured somewhere...");
        console.error("Error registering user:", errorCode, errorMessage);
      });
  };

  const logInUser = async (email, password) => {
    try {
      setLoading(true);

      //Built in function by firebase for autheticating users.
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const fetchedUser = userCredential.user; // Access the logged-in user's information
      ////console.log("User logged in:", fetchedUser);
      const userAcc = await getEntryById("users", fetchedUser.uid);
      setLoading(false);
      //Store the user's account data in a locally accessible piece of data in the context.
      setUser({
        username: userAcc.username,
        id: userAcc.id,
        handle: userAcc.handle,
        profilePic: userAcc.profilePic,
        dateJoined: userAcc.dateJoined,
        preferredTags: userAcc.tags,
        role: userAcc.role,
      });

      laraveLOG(
        "User has logged in with the following details: \n " +
          JSON.stringify({
            id: userAcc.id,
            email: email,
            date: new Date().toLocaleString(),
          })
      );

      const authedUser = getAuth().currentUser;
      console.log("authedUser");
      console.log(authedUser);
      setToken(fetchedUser.accessToken);

      alert.success("Welcome to GamerHub");
      // goBack()
      // return user; // Return the user object if needed
    } catch (error) {
      setLoading(false);
      console.error("Error logging in:", error.message);
      alert.error("An error occured somewhere...");
      throw error; // Handle errors, e.g., incorrect credentials
    }
  };

  //Basic validation for the register and log in.
  const checkEqual = () => {
    ////console.log("User pwordchec");
    const pass = pWordRef.current.value;
    const cpass = cWordRef.current.value;
    const email = emailRef.current.value;

    if (isSecurePassword(pass)) {
      if (pass == cpass) {
        registerUser(email, pass);
      }
    }
  };

  function isSecurePassword(password) {
    //Using regex, the password is tested against a pattern to determine if
    //it satistfies the requirements of a strong password.
    ////console.log("User regex chec");
    // Regex pattern for a secure password
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    // Test the password against the regex
    if (passwordRegex.test(password)) {
      ////console.log("passed")
      return true;
    } else {
      setError(
        "Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one digit, and one special character."
      );
      return false;
    }
  }

  return (
    <div class="absolute inset-0 bg-black/40 backdrop-blur-sm z-[99999999] flex items-center justify-center">
      {loading ? <LoadingScreen /> : <></>}

      <div className="flex items-center justify-center aspect-[16/9] w-[70vw]  bg-[#121212]">
        <div className="child">
          <Close
            className="close-icon login-close"
            style={{ fontSize: 30, display: "none" }}
            onClick={() => {
              navigate("/home");
            }}
          />

          <div className="mb-4">
            {registerMode ? (
              <p className="font-bold">
                {" "}
                Sign up<br></br>
                <span className="font-normal">Your Adventure begins here</span>
              </p>
            ) : (
              <p className="font-bold text-2xl tracking-tight">
                Log in<br></br>
                <span className="font-normal text-base">
                  Welcome back, Player!
                </span>
              </p>
            )}
          </div>

          {/* It depends on the registermode variable whether the login or register page gets rendered.  */}
          {!registerMode ? (
            <div className="login-form login-box">
              <div className="form">
                <div className="input-container">
                  <TextField
                    ref={emailRef}
                    id="username"
                    name="username"
                    label="Outlined"
                    required
                    variant="outlined"
                    pattern="email"
                  />
                </div>
                <div className="input-container">
                  <input
                    ref={pWordRef}
                    type="password"
                    name="pword"
                    id="pword"
                    placeholder=" "
                    required
                  />
                  <label htmlFor="pword">Password</label>
                </div>
                {error == "" ? (
                  ""
                ) : (
                  <div className="error-box">
                    <p>{error}</p>
                  </div>
                )}
                <div className="login-row">
                  {/* Register the user */}
                  <button
                    onClick={() => {
                      navigate("/home");
                    }}
                  >
                    <p>Log in</p>
                  </button>

                  <p className="regBtn">
                    Not a user yet?
                    {/* This button changes that said registerMode variable to render the register page instead/ */}
                    <span
                      onClick={(e) => {
                        e.preventDefault();
                        setRegisterMode(true);
                      }}
                    >
                      <>Register Here</>
                    </span>
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="login-form login-box">
              <div className="form">
                <div className="input-container">
                  <input
                    ref={emailRef}
                    type="text"
                    name="username"
                    id="username"
                    placeholder=" "
                    required
                  />
                  <label htmlFor="username">Username or Email</label>
                </div>
                <div className="input-container">
                  <input
                    ref={pWordRef}
                    type="password"
                    name="pword"
                    id="pword"
                    placeholder=" "
                    required
                  />
                  <label htmlFor="pword">Password</label>
                </div>
                <div className="input-container">
                  <input
                    ref={cWordRef}
                    type="password"
                    name="cword"
                    id="cword"
                    placeholder=" "
                    required
                  />
                  <label htmlFor="cword">Confirm Password</label>
                </div>
                {error == "" ? (
                  ""
                ) : (
                  <div className="error-box">
                    <p>{error}</p>
                  </div>
                )}
                <div className="login-row">
                  <button onClick={() => checkEqual()}>
                    <p>Sign up</p>
                  </button>
                  {/* The counterpart for the function earlier that renders the register page - this renders the login page. */}
                  <p className="regBtn">
                    Already a user?
                    <span
                      onClick={(e) => {
                        e.preventDefault();
                        setRegisterMode(false);
                      }}
                    >
                      Login Here
                    </span>
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
        <div className="child banner z-[99999999] bg-red-300">
          {/* This is for the picture banner on the right */}
          <Close
            className="close-icon banner-close"
            style={{ fontSize: 30, right: 30, top: 30 }}
            onClick={() => {
              goBack();
            }}
          />

          <div className="image-overlay"></div>
          <div className="pattern-overlay"></div>
          <div className="welcome-text">
            <div className="text-row">
              <img src={Logo} alt="GameHub" />
              <p>GameHub</p>
            </div>
            <div className="text-desc">
              <p>
                Connect with fellow gamers and discuss<br></br>your favorite
                games.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

RegisterLoginBox.propTypes = {
  register: PropTypes.bool,
};

export default RegisterLoginBox;

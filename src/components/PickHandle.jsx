import '../styles/loginRegister.css'
import Google from '@mui/icons-material/Google';
import Close from '@mui/icons-material/Close';
import PropTypes from "prop-types";
import {  useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRef } from 'react';
import { auth } from '../fireBase';
import LoadingScreen from './loadingScreen';
// import { UseAuthContext } from '../contexts/authContext';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';

import { addEntryWithId, getEntryById } from '../firebaseOperations';
import { UseAuthContext } from '../contexts/authContext';
import { useAlertContext } from '../contexts/alertContext';

function RegisterLoginBox(props) {

  // const { setUser } = UseAuthContext();
  const {user, setUser, setToken} = UseAuthContext();
  const [registerMode, setRegisterMode] = useState(props.register);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const emailRef = useRef();
  const pWordRef = useRef();
  const cWordRef = useRef();
  const alert = useAlertContext();


  useEffect(() => {

    setError("");


    return;
  }, [registerMode, loading])

  // const patterArray =    
  const goBack = () => {
    navigate(-1);
  }



  // const patterArray =  


  const registerUser = async (email, password) => {

    setLoading(true)

    ////console.log("User registration");
    createUserWithEmailAndPassword(auth, email, password)
      .then(async (userCredential) => {
       setLoading(false)
    // Successfully registered
        const user = userCredential.user;
        ////console.log("User registered:", user.uid);
        alert.success("account created successfully!");
        
        try {
          setLoading(true)
       
          const username = ""; 
          const handle = "";
       
       
       
          await addEntryWithId("users", user.uid, {email: email, password: password, username: username, handle: handle, dateJoined:new Date().toLocaleString() + "", role:"user"  })
          
        } catch (error) {
          //console.log(error)
          alert.error("An error occured somewhere...");          
        }
        setLoading(false)
        logInUser(email, password);
      })
      .catch((error) => {
        // Handle errors here
        setLoading(false)
        const errorCode = error.code;
        const errorMessage = error.message;
        setError(errorMessage)
        alert.error("An error occured somewhere...");
        console.error("Error registering user:", errorCode, errorMessage);
      });
  }

const logInUser = async (email, password) => {

  try {
    setLoading(true)

    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const fetchedUser = userCredential.user; // Access the logged-in user's information
    ////console.log("User logged in:", fetchedUser);
    setLoading(false)
    alert.success("Welcome to Gamerhub!");
    setUser( await getEntryById(user.id, "users", fetchedUser.uid))
    setToken( fetchedUser.accessToken)
    goBack()
    return user; // Return the user object if needed
  } catch (error) {
    setLoading(false)
    console.error("Error logging in:", error.message);
    alert.error("An error occured somewhere...");
    throw error; // Handle errors, e.g., incorrect credentials
  }
};
const checkEqual = () => {
  ////console.log("User pwordchec");
  const pass = pWordRef.current.value
  const cpass = cWordRef.current.value
  const email = emailRef.current.value

  if (isSecurePassword(pass)) {
    if (pass == cpass) {
      registerUser(email, pass)
    }
  }
}



  function isSecurePassword(password) {

    ////console.log("User regex chec");
    // Regex pattern for a secure password
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    // Test the password against the regex
    if (passwordRegex.test(password)) {
      ////console.log("passed")
      return true;
    } else {
      setError("Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one digit, and one special character.")
      return false;
    }
  }

  return (
    <div className="overlay">

      {loading ? <LoadingScreen /> : <></>}

      <div className="flex-container">
        <div className="child">
          <Close className='close-icon login-close' style={{ fontSize: 30, display: "none" }} onClick={() => { goBack() }} />

          <div className="logo login-box">
            <h1>Koigoe</h1>
            {registerMode
              ? <p> Sign up </p>
              : <p>Log in </p>
            }

          </div>

          {!registerMode ? <div className="login-form login-box">
            <div className='form'>

              <input ref={emailRef} type="text" name="username" id="username" placeholder="Username Or Email" required pattern='email' />
              <input ref={pWordRef} type="password" name="pword" id="pword" placeholder="Password" required />
              {error == "" ? "" :
                <div className="error-box">
                  <p>{error}</p>
                </div>}
              <div className="row">
                <button onClick={() => logInUser(emailRef.current.value, pWordRef.current.value)}><p>Log in</p></button>
                <button onClick={(e) => { e.preventDefault(); setRegisterMode(true); }}>
                  <p>Sign up</p>
                </button>
              </div>


              <div className="alternate-login">
                <p>Or you could log in with:</p>
                <Google className="Icon" />
              </div>


            </div>



          </div>

            :

            <div className="login-form login-box">
              <div className='form'>

                <input ref={emailRef} type="text" name="username" id="username" placeholder="Username Or Email" required />
                <input ref={pWordRef} type="password" name="pword" id="pword" placeholder="Password" required />
                <input ref={cWordRef} type="password" name="cword" id="cword" placeholder="Confirm Password" required />
                {error == "" ? "" :
                  <div className="error-box">
                    <p>{error}</p>
                  </div>}
                <div className="row">
                  <button onClick={(e) => { e.preventDefault(); setRegisterMode(false); }}>
                    <p>Back to Login</p>
                  </button>
                  <button onClick={() => checkEqual()}><p>Sign up</p></button>
                </div>


                <div className="alternate-login">
                  <p>Or you could log in with:</p>
                  <Google className="Icon" />
                </div>

              </div>



            </div>}

        </div>
        <div className="child banner">
          <Close className='close-icon banner-close' style={{ fontSize: 30, right: 30, top: 30 }} onClick={() => { goBack() }} />

          <div className="image-overlay">
          </div>
          <div className="pattern-overlay">
          </div>
          <h1>Earn points for engagement!</h1>

        </div>


      </div>

    </div>
  )
}

RegisterLoginBox.propTypes = {
  register: PropTypes.bool
}

export default RegisterLoginBox

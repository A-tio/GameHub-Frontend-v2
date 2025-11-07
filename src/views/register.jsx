  import { useNavigate } from "react-router-dom";
import { UseAuthContext } from "../contexts/authContext";
import { useEffect } from "react";
import '../styles/loginRegister.css'
import RegisterLoginBox from "../components/RegisterLoginBox";

function Register() {

  const { user, token } = UseAuthContext();
  const navigate = useNavigate();


  useEffect(() => {

    if (token && user) {
      navigate('/home');
      ////console.log("User has redirected successfully to guest section");
    }

  }, [])


  // if (token && user) {
  //     navigate('/home');
  //     ////console.log("User has redirected successfully to guest section");    
  // }

  return (
    <RegisterLoginBox register = {true} />
  )
}

export default Register

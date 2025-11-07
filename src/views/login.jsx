import '../styles/loginRegister.css';
import RegisterLoginBox from "../components/RegisterLoginBox";

function Login() {
	return (
		<RegisterLoginBox register={false} />
	);
}

export default Login;

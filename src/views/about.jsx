import "../styles/about.css";
import gamebg from '../assets/images/game 1.png';
import logoo from '../assets/images/logo-colored.svg';
function About() {

  return (
    <div className="about-main">
      <div className="about-content">
        <img src={gamebg
        } alt="game" className="gamebg" />
      </div>
      <p className="about-title">About us</p>
      <p className="about-text">
        Welcome to <span className="span">GameHub! </span>your ultimate destination for all things gaming!<br></br>Whether you're a casual player or a hardcore enthusiast, we're here to bring<br></br>you the latest news, discussions, and insights from the gaming world.</p>
        <img src={logoo} alt="logo" className="logoo" />
        <p className="game-title">GameHub</p>
        <p className="game-desc">Connect with fellow gamers</p>
    </div>
  )
}

export default About

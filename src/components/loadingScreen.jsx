import throbber from '../assets/images/throbber.svg';


function LoadingScreen() {
 

  return (
    <div className="loading-overlay">
      <img src={throbber} alt="" />
    </div>
  )
}


export default LoadingScreen

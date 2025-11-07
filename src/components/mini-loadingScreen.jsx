import throbber from '../assets/images/throbber.svg';


function MinLoadingScreen() {
 

  return (
    <div className="mini-loading-overlay">
      <img src={throbber} alt="" />
    </div>
  )
}


export default MinLoadingScreen

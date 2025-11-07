import throbber from '../assets/images/throbber.svg';
import PropTypes from 'prop-types';

function SuspendedScreen(props) {
 
  


  return (
    <div className="loading-overlay" style={{ display:'flex', flexDirection:'column' }}>
      
      <h1>{props.suspendedTime}</h1>
      <p>Your suspension lasts until: {props.suspendedDate} </p>

    </div>
  )
}


SuspendedScreen.propTypes = {

  suspendedTime: PropTypes.string,
  suspendedDate: PropTypes.array 

}

export default SuspendedScreen

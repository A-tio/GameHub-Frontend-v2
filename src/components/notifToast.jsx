import smile from '../assets/Emote Pack/Compilation/smile_128x128.png';
import scared from '../assets/Emote Pack/Compilation/scared_128x128.png';
import love from '../assets/Emote Pack/Compilation/heartEyes_128x128.png';
import "../styles/notifStyle.css"
import {useAlertContext} from '../contexts/alertContext';
import React from 'react';

const NotifToast = () => {

  const alert = useAlertContext();
  ////console.log(alert);
  const imageUsed = (() => {
    switch (alert.alert) {
      case "success":
        return smile;
      case "failure":
        return scared;
      case "love":
        return love;
      default:
        return smile;
    }
  })();

  if (alert.alert !== 'none' && alert.alertText !== null) {
    return  <div className={`notification ${alert.alert}`}>
            <p>{alert.alertText}</p>
          </div>     
   

  } else {
    return null;
  }
}
export default React.memo(NotifToast);
import NotifComponent from "./components/notifToast";
import { createPortal } from "react-dom";
import PropTypes from "prop-types";

export default function NotifPortal(props) {
 

  ////console.log("portal created")
  ////console.log(props)
  return (
    <>
      {createPortal(
        <NotifComponent type={props.type} message={props.message} />,
        document.getElementById("notification-root")
      )}
    </>
  );
}

NotifPortal.propTypes = {
  type: PropTypes.string,
  message: PropTypes.string,
}


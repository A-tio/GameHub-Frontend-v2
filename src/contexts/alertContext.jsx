import PropTypes from 'prop-types';
import React, { useContext, useState } from 'react';


const AlertContext = React.createContext(null);
AlertContext.displayName = "AlertContext";

const AlertProvider = ({children}) => {
    const [alert, setAlert] = useState("success");
    const [alertText, setAlertText] = useState(null);
    // ////console.log(alert)

    return (
        <AlertContext.Provider
          value={{
            alert: alert,
            alertText: alertText,
            success: (text, timeout) => {
              setAlertText(text);
              setAlert("success");
              setTimeout(() => {
                setAlert("none");
              }, timeout * 1000 || 5000)
    
            },
            error: (text, timeout) => {
              setAlertText(text);
              setAlert("failure");
              setTimeout(() => {
                setAlert("none");
              }, timeout * 1000 || 5000)
            },
            clear: () => (setAlert("none")),
          }}
        >
          {children}
        </AlertContext.Provider>
      );
    };

    
AlertProvider.propTypes = {
    children: PropTypes.node.isRequired,
}

const useAlertContext = () => {
  const context = useContext(AlertContext);
  if (!context) {
      throw new Error("useAlertContext must be used within an AlertProvider");
  }
  return context;
};

    export { AlertProvider, useAlertContext };
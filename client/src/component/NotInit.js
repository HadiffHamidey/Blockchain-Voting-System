// Node module
import React from "react";

const NotInit = () => {
  // Component: Displaying election not initialize message.
  return (
    <div className="container-main">
    <div className="container-item info" style={{backgroundColor: "white", boxShadow:"5px 5px #787878"}}>
      <center>
        <h3>The election has not been initialize.</h3>
        <p>Please Wait..</p>
      </center>
    </div>
    </div>
  );
};
export default NotInit;

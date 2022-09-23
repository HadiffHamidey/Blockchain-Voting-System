// Node module
import React from "react";
import { Link } from 'react-router-dom';

const NotVerified = () => {
  // Component: Displaying election not initialize message.
  
  return (
    <div className="container-item info">
        <center>
            <h3>You are not verified yet. Please make sure to register your details.</h3>
              Go to{" "}
            <Link
              to="/"
              style={{ color: "black", textDecoration: "underline" }}
            >
              Verify
            </Link>
        </center>
    </div>
  );
};
export default NotVerified;

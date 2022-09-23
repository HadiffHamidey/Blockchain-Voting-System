import React from "react";

const ElectionStatus = (props) => {
  const electionStatus = {
    padding: "11px",
    margin: "7px",
    width: "100%",
    border: "1px solid black",
    marginLeft: "auto",
    marginRight: "auto",
    textAlign: "center",
    borderRadius: "0.5em",
    overflow: "auto",
    alignItems: "center",
    justifyContent: "space-around",
    display: "flex",
  };

  return (

    <div
      className="container-main"
      style={{ borderTop: "1px solid", marginTop: "0px"}}
    >
      <h3>Election Status</h3>
      <div className="container-item" style={{backgroundColor:"white", margin:"0px"}}>
      <div style={electionStatus}>
        <p>Started Time: {props.elStarted ? props.elBegin : ""}</p>
        <p>Ended Time: {props.elEnded ? props.elFinish : ""}</p>
      </div>
      </div>
    </div>

  );
};

export default ElectionStatus;

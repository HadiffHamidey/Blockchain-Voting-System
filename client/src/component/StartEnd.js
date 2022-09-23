import React from "react";

const StartEnd = (props) => {
  const btn = {
    display: "block",
    padding: "21px",
    margin: "7px",
    minWidth: "max-content",
    textAlign: "center",
    width: "333px",
    alignSelf: "center",
  };
  return (
    <div className="container-main">
      {!props.elStarted ? (
        <>
          {/* edit here to display start election Again button */}
          {!props.elEnded ? (
            <>
                <button type="submit" style={btn}>
                  Start Election {props.elEnded ? "Again" : null}
                </button>
            </>
          ) : (
            <div className="container-item attention">
              <center>
                <p><b>The election ended. Re-deploy the contract to start election again.</b></p>
              </center>
            </div>
          )}
        </>
      ) : (
        <>
            <button
              type="button"
              // onClick={this.endElection}
              onClick={props.endElFn}
              style={btn}
            >
              End
            </button>
        </>
      )}
    </div>
  );
};

export default StartEnd;

import React from "react";

function UserHome(props) {
  return (
    <div>
      <div className="container-main">
        <div className="container-list title" style={{backgroundColor:"#989898", paddingLeft:"100px", paddingRight:"100px", paddingTop:"30px", paddingBottom:" 30px", boxShadow:"5px 10px #787878"}}>
          <h1>{props.el.electionTitle}</h1>
          <br />
          <center><i>By: {props.el.organizationTitle}</i></center>
          <table cellspacing="0" cellpadding="0" style={{ marginTop: "21px", border:"1px solid black", backgroundColor:"#D3D3D3" }}>
            <tr style={{borderBottom:"1px solid black"}}>
              <th>Admin:</th>
              <td>
                Mohammad Hadiff bin Hamidey
              </td>
            </tr>
            <tr>
              <th>Contact:</th>
              <td style={{ textTransform: "none" }}>hadiffhamidey@gmail.com</td>
            </tr>
          </table>
        </div>
      </div>
    </div>
  );
}

export default UserHome;

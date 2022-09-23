import React, { Component } from "react";

import Navbar from "../Navbar/Navigation";
import NavbarAdmin from "../Navbar/NavigationAdmin";
import NotVerified from "../NotVerified";

import getWeb3 from "../../getWeb3";
import Election from "../../contracts/Election.json";

import "./Info.css";

class Info extends Component {
  constructor(props) {
    super(props);
    this.state = {
        eth_Acc:'',
        ElectionInstance: undefined,
        web3: null,
        accounts: null,
        isAdmin: false,
        candidates: [],
        candidateCount: undefined,
        currentVoter: {
          address: undefined,
          name: null,
          phone: null,
          Ic: null,
          hasVoted: false,
          isVerified: false,
          isLoggedIn: false,
        },
    };
  }

  componentDidMount = async () => {
    // refreshing page only once
    if (!window.location.hash) {
      window.location = window.location + "#loaded";
      window.location.reload();
    }

    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();

      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = Election.networks[networkId];
      const instance = new web3.eth.Contract(
        Election.abi,
        deployedNetwork && deployedNetwork.address
      );
      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({
        web3: web3,
        ElectionInstance: instance,
        account: accounts[0],
      });

      // Loading current voters
      const voter = await this.state.ElectionInstance.methods
        .voterDetails(this.state.account)
        .call();
      this.setState({
        currentVoter: {
          address: voter.voterAddress,
          name: voter.name,
          phone: voter.phone,
          Ic: voter.Ic,
          hasVoted: voter.hasVoted,
          isVerified: voter.isVerified,
          isLoggedIn: voter.isLoggedIn,
        },
      });

      const admin = await this.state.ElectionInstance.methods.getAdmin().call();
      if (this.state.account === admin) {
        this.setState({ isAdmin: true });
      }
      this.setState({ eth_Acc: this.state.account })

    } catch (error) {
      // Catch any errors for any of the above operations.
      console.error(error);
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`
      );
    }
  };

  render() {
    if (!this.state.web3) {
      return (
        <>
          {this.state.isAdmin ? <NavbarAdmin /> : <Navbar />}
          <center>Loading Web3, accounts, and contract...</center>
        </>
      );
    }

    if (!this.state.isAdmin && !this.state.currentVoter.isVerified){
      return(
        <>
          <NotVerified />
        </>
      )
    }

    return (
      <>
      <Navbar />
      
      <div className="container-main">
          <div
              className="container-main"
              style={{ borderTop: this.state.currentVoter.isVerified
                  ? null
                  : "1px solid", }}
          >
          <div class="wrapper">
            <div class="left">
              <img class="avatar" src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png" 
                alt="user" width="100"/>
              <h4>{this.state.currentVoter.name}</h4>
            </div>
            <div class="right">
              <div class="info">
                <h3>Information</h3>
                  <div class="info_data">
                    <div class="data">
                      <h4>Account Address: </h4>
                      <p>{this.state.currentVoter.address}</p>
                      <h4>Ic Number:</h4>
                      <p> {this.state.currentVoter.Ic}</p>
                      <h4>Phone:</h4>
                      <p>{this.state.currentVoter.phone}</p>
                    </div>
                  </div>
              </div>
              <div class="info">
                <h3>Status</h3>
                  <div class="info_data">
                    <div class="data">
                        <h4>Verification Status</h4>
                        <p>{this.state.currentVoter.isVerified ? "Verified" : "Not verified"}</p>
                    </div>
                    <div class="data">
                      <h4>Vote Status</h4>
                        <p>{this.state.currentVoter.hasVoted ? "Voted" : "Not voted"}</p>
                    </div>
                  </div>
              </div>
            </div>
          </div>
        </div>

      </div>
      </>
    );
  }
}


export default Info;
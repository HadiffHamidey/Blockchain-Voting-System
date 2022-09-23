// Node modules
import React, { Component } from "react";
import { Link } from "react-router-dom";

// Components
import Navbar from "../Navbar/Navigation";
import NavbarAdmin from "../Navbar/NavigationAdmin";
import NotInit from "../NotInit";
import '../Navbar/Button.css';

// Contract
import getWeb3 from "../../getWeb3";
import Election from "../../contracts/Election.json";

// CSS
import "./Voting.css";

export default class Voting extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ElectionInstance: undefined,
      account: null,
      web3: null,
      isAdmin: false,
      candidateCount: undefined,
      candidates: [],
      voteTime: "",
      isElStarted: false,
      isElEnded: false,
      elDetails: {},
      candidateName:"",
      candidateSlogan:"",
      candidateParty:"",
      currentVoter: {
        address: undefined,
        name: null,
        phone: null,
        Ic: null,
        vote_Time: null,
        vote_Receipt: null,
        hasVoted: false,
        isVerified: false,
      },
    };
  }
  componentDidMount = async () => {
    // refreshing once
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

      // Get total number of candidates
      const candidateCount = await this.state.ElectionInstance.methods
        .getTotalCandidate()
        .call();
      this.setState({ candidateCount: candidateCount });

      // Get start and end values
      const start = await this.state.ElectionInstance.methods.getStart().call();
      this.setState({ isElStarted: start });
      const end = await this.state.ElectionInstance.methods.getEnd().call();
      this.setState({ isElEnded: end });

      // Getting election details from the contract
      const electionLocation = await this.state.ElectionInstance.methods
        .getElectionLocation()
        .call();
      const electionTitle = await this.state.ElectionInstance.methods
        .getElectionTitle()
        .call();
      const organizationTitle = await this.state.ElectionInstance.methods
        .getOrganizationTitle()
        .call();

      // Loading Candidates details
      for (let i = 1; i <= this.state.candidateCount; i++) {
        const candidate = await this.state.ElectionInstance.methods
          .candidateDetails(i - 1)
          .call();
        this.state.candidates.push({
          id: candidate.candidateId,
          header: candidate.header,
          party: candidate.party,
          slogan: candidate.slogan,
        });
      }
      this.setState({ candidates: this.state.candidates });

      // Loading current voter
      const voter = await this.state.ElectionInstance.methods
        .voterDetails(this.state.account)
        .call();
      this.setState({
        currentVoter: {
          address: voter.voterAddress,
          name: voter.name,
          phone: voter.phone,
          Ic: voter.Ic,
          vote_Time:voter.vote_Time,
          vote_Receipt:voter.vote_Receipt,
          hasVoted: voter.hasVoted,
          isVerified: voter.isVerified,
        },
      });

      this.setState({
        elDetails: {
          electionLocation: electionLocation,
          electionTitle: electionTitle,
          organizationTitle: organizationTitle,
        },
      });

      // Admin account and verification
      const admin = await this.state.ElectionInstance.methods.getAdmin().call();
      if (this.state.account === admin) {
        this.setState({ isAdmin: true });
      }
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`
      );
      console.error(error);
    }
  };

  renderCandidates = (candidate) => {
    var today = new Date();
    const time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    var result           = '0x';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < 28; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    const castVote = async (id) => {
      this.state.currentVoter.vote_Time = time;
      this.state.currentVoter.vote_Receipt = result
      await this.state.ElectionInstance.methods
        .vote(id, this.state.currentVoter.vote_Time, this.state.currentVoter.vote_Receipt)
        .send({ from: this.state.account, gas: 1000000 });
      window.location.reload();
    };
    const confirmVote = async (id, header, party) => {
      var r = window.confirm(
        "Vote for " + header + " with Id " + id + " from party " + party + ".\nAre you sure?"
      );
      if (r === true) {
        castVote(id);
      }
    };
    return (

        <div className="container-main" style={{margin:"20px", display:"inline-block", overflow: "hidden", maxWidth:"300px", maxHeight:"500px",height:"440px", boxShadow:"0 4px 8px 0 rgba(0,0,0,0.2)", transition:"0.3s"}}>
            <img src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png" style={{width:"220px"}} alt="Avatar"/>
            <div class="container" style={{padding:"2px 16px"}}>
            <h2><b><center>{candidate.header}</center></b></h2>
            <p style={{textAlign:"left"}}><b>Organization:</b> {candidate.party}</p>
            <p style={{textAlign:"left", whiteSpace:"initial"}}><b>Slogan:</b> <i>{candidate.slogan}</i></p>
          <center>
            <div style={{borderTop:"3px solid black", marginTop:"10px", marginBottom:"10px"}}></div>
          <button
            onClick={() => confirmVote(candidate.id, candidate.header, candidate.party)}
            className="btn"
            style={{backgroundColor:"red"}}
            disabled={
              !this.state.currentVoter.isVerified ||
              this.state.currentVoter.hasVoted
            }
          >
            Vote
          </button>
          </center>
          </div>

        </div>

    );
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

    return (
      <>
        {this.state.isAdmin ? <NavbarAdmin /> : <Navbar />}
        <div>
          {!this.state.isElStarted && !this.state.isElEnded ? (
            <NotInit />
          ) : this.state.isElStarted && !this.state.isElEnded ? (
            <>
              {this.state.currentVoter.isVerified ? (
                  this.state.currentVoter.hasVoted ? (
                    <div className="container-main">
                      <h2>Ballot Receipt</h2>
                      <div>
                        <p />
                        <div className="container-main" style={{margin:"20px", display:"inline-block", overflow: "hidden", width:"550px", maxHeight:"500px",height:"280px", boxShadow:"0 4px 8px 0 rgba(0,0,0,0.2)", transition:"0.3s"}}>
                            <div class="container" style={{padding:"2px 16px"}}>
                            <div style={{backgroundColor:"#BEBEBE", border:"2px solid black", marginTop:"15px", marginBottom:"20px", left:0}}>
                              <h2><b><center>Election {this.state.elDetails.electionTitle}</center></b></h2>
                              <small><center><b>By: {this.state.elDetails.organizationTitle}</b></center></small>
                            </div>
                            <p style={{textAlign:"left"}}><b>Submission time: </b>{this.state.currentVoter.vote_Time}</p>
                            <p style={{textAlign:"left"}}><b>Ballot Receipt ID: </b>{this.state.currentVoter.vote_Receipt}</p>
                          <center>
                            <div style={{borderTop:"3px solid black", marginTop:"30px", marginBottom:"10px"}}></div>
                            <Link
                            to="/Results"
                            style={{
                              color: "black",
                              textDecoration: "underline",
                            }}
                          >
                            See Results
                          </Link>
                          </center>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div style={{color:"white",backgroundColor:"rgb(31, 28, 28)",border:"2px solid red"}}>
                      <center><p style={{fontFamily:"Times New Roman, Times, serif", letterSpacing:"4px", fontSize:"20px"}}>Voting Section</p></center>
                    </div>
                  )
                ) : (
                    <div className="container-item attention">
                    <center>
                      <p>You're not registered. Please register first.</p>
                      <br />
                    </center>
                  </div>
                )
              }
              <div className="container-main" style={{overflowX:"hidden"}}>
                {this.state.currentVoter.hasVoted ? (
                  <div
                    className="container-item"
                    style={{ border: "1px solid black" }}
                  >
                    <center>That is all.</center>
                  </div>
                ) : (
                  <>
                  <h2>Candidates</h2>
                  <small>Total candidates: {this.state.candidates.length}</small>
                  <div>
                    <center>{this.state.candidates.map(this.renderCandidates)}</center>
                    <div
                      className="container-item"
                      style={{ border: "1px solid black" }}
                    >
                      <center>That is all.</center>
                    </div>
                  </div>
                  </>
                )}
              </div>
            </>
          ) : !this.state.isElStarted && this.state.isElEnded ? (
            <>
            <div style={{marginBottom:"55px"}}></div>
              <div className="container-item attention">
                <center>
                  <h3>The Election ended.</h3>
                  <br />
                  <Link
                    to="/Results"
                    style={{ color: "black", textDecoration: "underline" }}
                  >
                    See results
                  </Link>
                </center>
              </div>
            </>
          ) : null}
        </div>
      </>
    );
  }
}

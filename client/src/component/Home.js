// Node modules
import React, { Component } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import axios from 'axios';

// Components
import Navbar from "./Navbar/Navigation";
import NavbarAdmin from "./Navbar/NavigationAdmin";
import UserHome from "./UserHome";
import StartEnd from "./StartEnd";
import ElectionStatus from "./ElectionStatus";

// Contract
import getWeb3 from "../getWeb3";
import Election from "../contracts/Election.json";

// CSS
import "./Home.css";

// const buttonRef = React.createRef();
export default class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      eth_Acc:'',
      name:'',
      ic_Num:'',
      phone_Num:'',
      password:'',
      confPassword:'',
      msg:'',
      ElectionInstance: undefined,
      account: null,
      web3: null,
      isAdmin: false,
      startTime:"",
      endTime:"",
      elStarted: false,
      elEnded: false,
      elDetails: {},
      elTime: {},
      candidates: [],
      candidateCount: undefined,
      currentVoter: {
        address: undefined,
        name: null,
        phone: null,
        Ic: null,
        vote_Time: null,
        hasVoted: false,
        isVerified: false,
      },
    };
  }

  // refreshing once
  componentDidMount = async () => {
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

      // Total number of candidates
      const candidateCount = await this.state.ElectionInstance.methods
        .getTotalCandidate()
        .call();
      this.setState({ candidateCount: candidateCount });

      const admin = await this.state.ElectionInstance.methods.getAdmin().call();
      if (this.state.account === admin) {
        this.setState({ isAdmin: true });
      }

      // Get election start and end values
      const start = await this.state.ElectionInstance.methods.getStart().call();
      this.setState({ elStarted: start });
      const end = await this.state.ElectionInstance.methods.getEnd().call();
      this.setState({ elEnded: end });

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

      const timeStart = await this.state.ElectionInstance.methods
        .gettimeStart()
        .call();
      const timeEnd = await this.state.ElectionInstance.methods
        .gettimeEnd()
        .call();
      
      // Loading Candidates details
      for (let i = 0; i < this.state.candidateCount; i++) {
        const candidate = await this.state.ElectionInstance.methods
          .candidateDetails(i)
          .call();
        this.state.candidates.push({
          id: candidate.candidateId,
          header: candidate.header,
          party: candidate.party,
          slogan: candidate.slogan,
        });
      }

      this.setState({ candidates: this.state.candidates });

      this.setState({ voters: this.state.voters });

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
          vote_Time: voter.vote_Time,
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

      this.setState({
        elTime: {
          timeStart: timeStart,
          timeEnd: timeEnd,
        },
      });

      this.setState({ eth_Acc: this.state.account })

    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`
      );
      console.error(error);
    }
  };

  // end election
  endElection = async () => {
    var today = new Date();
    const time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    this.state.elTime.timeEnd = time;

    await this.state.ElectionInstance.methods
      .endElection(
        this.state.elTime.timeStart,
        this.state.elTime.timeEnd
      )
      .send({ from: this.state.account, gas: 1000000 });
    window.location.reload();
  };
  // register and start election
  registerElection = async (data) => {
    var x = "";
    var today = new Date();
    const time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    this.state.elTime.timeStart = time;

    await this.state.ElectionInstance.methods
      .setElectionDetails(
        data.electionLocation.toLowerCase(),
        data.electionTitle.toLowerCase(),
        data.organizationTitle.toLowerCase(),
        this.state.elTime.timeStart,
        x
      )
      .send({ from: this.state.account, gas: 1000000 });
    window.location.reload();
  };

  changeHandler = (ev)=>{
    let nam = ev.target.name
    let val = ev.target.value
    this.setState({
        [nam]: val
    })
  }

  updateVoterName = (ev) => {
    this.setState({ voterName: ev.target.value });

    let nam = ev.target.name
    let val = ev.target.value
    this.setState({
        [nam]: val
    })
  };

  updateVoterPhone = (ev) => {
    this.setState({ voterPhone: ev.target.value });

    let nam = ev.target.name
    let val = ev.target.value
    this.setState({
        [nam]: val
    })
  };

  updateVoterIc = (ev) => {
    this.setState({ voterIc: ev.target.value });

    let nam = ev.target.name
    let val = ev.target.value
    this.setState({
        [nam]: val
    })
  };

  register = async (e)=>{
    // checking password correction and fill the all form
    // after regestratioin redirect to login
    e.preventDefault()
    const { eth_Acc, name, ic_Num} = this.state;

    try{
      await axios.post('http://localhost:5000/login', {eth_Acc, name, ic_Num});
          if(this.state.eth_Acc !== "" && this.state.name !== "" && this.state.ic_Num !== "" && this.state.phone_Num !== ""){
              await this.state.ElectionInstance.methods
              .verifyVoter(this.state.voterName, this.state.voterPhone, this.state.voterIc)
              .send({ from: this.state.account, gas: 1000000 });
              
                  this.setState({
                    msg:"Register succesful",
                  })
                      
                  setTimeout(()=>{
                    window.location.reload();
                  }, 1500)
              
          }else{
              e.preventDefault()
              alert("Please fill all form")
          }
    }catch(error){
      e.preventDefault()
      alert("Combination of Name, Ethereum address, and IC number is not registered")
      if (error.response) {
        this.setState({
            msg: error.response.data.msg
        })
      }
    }

  }

  render() {
    const {msg} = this.state;
    if (!this.state.web3) {
      return (
        <>
          <Navbar />
          <center>Loading Web3, accounts, and contract...</center>
        </>
      );
    }

    if (!this.state.isAdmin && !this.state.currentVoter.isVerified){
      return(
        <>
          <div className="container-main">
          <h2>Authentication Page</h2>
          <small><center>{msg}</center></small>
          <div class="login-box">
            <h2>Register</h2>
            <form>
              <div class="user-box">
              <input
                  type="text"
                  value={this.state.account}
                  onChange={this.changeHandler}
                />{" "}
                <label>Ethereum Account Address</label>
              </div>

              <div class="user-box">
              <input
                  type="text"
                  name="name"
                  value={this.state.voterName}
                  onChange={this.updateVoterName}
                required/>{" "}
                <label>Name</label>
              </div>

              <div class="user-box">
              <input
                  type="text"
                  name="ic_Num"
                  value={this.state.voterIc}
                  onChange={this.updateVoterIc}
                required/>{" "}
                <label>Ic Number</label>
              </div>

              <div class="user-box">
              <input
                  type="text"
                  name="phone_Num"
                  value={this.state.voterPhone}
                  onChange={this.updateVoterPhone}
                required/>{" "}
                <label>Phone Number</label>
              </div>

              {/* eslint-disable-next-line jsx-a11y/anchor-is-valid*/}
              <a href="#">
                <span></span>
                <span></span>
                <span></span>
                <span></span>
                <button
                onClick={this.register} style={{backgroundColor:"transparent", border:"none"}}
                >
                Register
              </button>
              </a>
            </form>
          </div>
        </div>
        </>
      );
    }

    return (
      <>
        {this.state.isAdmin ? <NavbarAdmin /> : <Navbar />}
        <div className="container-main">
          {!this.state.elStarted & !this.state.elEnded ? (
            <div className="container-item info" style={{backgroundColor: "white", boxShadow:"5px 5px #787878"}}>
              <center>
                <h3>The election has not been initialize.</h3>
                {this.state.isAdmin ? (
                  <p>Set up the election.</p>
                ) : (
                  <p>Please wait..</p>
                )}
              </center>
            </div>
          ) : null}
        </div>
        {this.state.isAdmin ? (
          <>
            <this.renderAdminHome />
          </>
        ) : this.state.elStarted ? (
          <>
            <UserHome el={this.state.elDetails} />
          </>
        ) : !this.state.elStarted && this.state.elEnded ? (
          <>
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
      </>
    );
  }
  
  renderAdminHome = () => {
  
    const EMsg = (props) => {
      return <span style={{ color: "tomato" }}>{props.msg}</span>;
    };

    const AdminHome = () => {
      // Contains of Home page for the Admin

      const {
        handleSubmit,
        register,
        formState: { errors },
      } = useForm();

      const onSubmit = (data) => {
        this.registerElection(data);
      };

      // eslint-disable-next-line 
      if (this.state.candidateCount <= 1){
        return (
          //{/* about-election */}
          <div className="about-election">
            <h3 style={{textAlign:"center"}}>Candidate List</h3>
            {loadAdded(this.state.candidates)}
          </div>
        );
      }

        return (
          <div>
            <form onSubmit={handleSubmit(onSubmit)}>
              {!this.state.elStarted & !this.state.elEnded ? (
                <div className="container-main">
                  
                  {/* about-election */}
                  <div className="about-election">
                    <h3>Setup Election</h3>
                    <div className="container-item center-items">
                      <div>
                        <label className="label-home">
                          Election Title{" "}
                          {errors.electionTitle && <EMsg msg="*required" />}
                          <input
                            className="input-home"
                            type="text"
                            placeholder="eg. School Election"
                            {...register("electionTitle", {
                              required: true,
                            })}
                          />
                        </label>
                        <label className="label-home">
                          Election Location{" "}
                          {errors.electionLocation && <EMsg msg="*required" />}
                          <input
                            className="input-home"
                            type="text"
                            placeholder="eg. Bukit Padang"
                            {...register("electionLocation", {
                              required: true,
                            })}
                          />
                        </label>
                        <label className="label-home">
                          Organization Name{" "}
                          {errors.organizationName && <EMsg msg="*required" />}
                          <input
                            className="input-home"
                            type="text"
                            placeholder="eg. Lifeline Academy"
                            {...register("organizationTitle", {
                              required: true,
                            })}
                          />
                        </label>
                      </div>
                    </div>
                  </div>
                  
                </div>
              ) : this.state.elStarted ? (
                <UserHome el={this.state.elDetails} />
              ) : null}

              <StartEnd
                elStarted={this.state.elStarted}
                elEnded={this.state.elEnded}
                endElFn={this.endElection}
              />

              <ElectionStatus
                elStarted={this.state.elStarted}
                elEnded={this.state.elEnded}
                elBegin={this.state.elTime.timeStart}
                elFinish={this.state.elTime.timeEnd}
              />
            </form>
          </div>
        );
    };
    return <AdminHome />;
  };
}

export function loadAdded(candidates) {
  return (
    <div className="container-main" style={{ borderTop: "1px solid" }}>
      {candidates.length <= 1 ? (
        <div className="container-item alert">
          <center>No candidates added. </center>
          <center>Please make sure to{" "}
          <Link
              title="candidate"
              to="/addCandidate"
              style={{
              color: "black",
              fontWeight: "bold",
              textDecoration: "underline",
              }}
          >
              Add Candidates
          </Link>{" "}
            before starting election</center>
        </div>
      ) : (
        <></>
      )}
    </div>
  );
}

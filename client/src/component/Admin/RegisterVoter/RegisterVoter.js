import React, { Component } from "react";
import axios from "axios";

import Navbar from "../../Navbar/Navigation";
import NavbarAdmin from "../../Navbar/NavigationAdmin";

import getWeb3 from "../../../getWeb3";
import Election from "../../../contracts/Election.json";

import AdminOnly from "../../AdminOnly";

export default class RegisterVoter extends Component {
  constructor(props) {
    super(props);
    this.state = {
        name:'',
        ic_Num:'',
        eth_Acc:'',
        msg:'',
        ElectionInstance: undefined,
        web3: null,
        accounts: null,
        isAdmin: false,
        header: "",
        party: "",
        slogan: "",
        candidates: [],
        candidateCount: undefined,
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

      const admin = await this.state.ElectionInstance.methods.getAdmin().call();
      if (this.state.account === admin) {
        this.setState({ isAdmin: true });
      }

    } catch (error) {
      // Catch any errors for any of the above operations.
      console.error(error);
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`
      );
    }
  };

  changeHandler = (ev)=>{
    let nam = ev.target.name
    let val = ev.target.value
    this.setState({
        [nam]: val
    })
}

register = async (e)=>{
    // checking password correction and fill the all form
    // after regestratioin redirect to login
    e.preventDefault()
    const { eth_Acc, name, ic_Num } = this.state;
        if(this.state.ic_Num || this.state.name || this.state.eth_Acc){
            axios.post('http://localhost:5000/users', { name, eth_Acc, ic_Num })
            .then((response)=>{
            
                if(response.data.msg){
                    this.setState({
                        msg:response.data.msg,
                    })
                    setTimeout(()=>{
                      window.location.reload();
                    }, 1800)
                    this.setState({
                        msg:"Register succesful",
                    })
                }else{
                    this.setState({
                        msg:response.data.warning, 
                    })
                }
                
            })
            
        }else{
            e.preventDefault()
            alert("Please fill all form")
        }

}


  render() {
    const { name, eth_Acc, ic_Num, msg } = this.state;
    //let msg;
    if (!this.state.web3) {
      return (
        <>
          {this.state.isAdmin ? <NavbarAdmin /> : <Navbar />}
          <center>Loading Web3, accounts, and contract...</center>
        </>
      );
    }
    if (!this.state.isAdmin) {
      return (
        <>
          <Navbar />
          <AdminOnly page="Add Candidate Page." />
        </>
      );
    }
    return (
      <>
        <NavbarAdmin />
        <div className="container-main">
          <h2>Register eligible voter</h2>
          <small><b>{msg}</b></small>
          <div className="container-item">
            <form className="form">
              <label className={"label-ac"}>
                Name
                <input
                  className={"input-ac"}
                  type="text"
                  name="name"
                  placeholder="eg. Adam"
                  value={name}
                  onChange={this.changeHandler}
                />
              </label>
              <label className={"label-ac"}>
                Ethereum Address
                <input
                  className={"input-ac"}
                  type="text"
                  name="eth_Acc"
                  placeholder="eg. 0x41B7169176ed2D1eDd9B5Bc3C5d2E076539E83Ff"
                  value={eth_Acc}
                  onChange={this.changeHandler}
                />
              </label>
              <label className={"label-ac"}>
                IC Number
                <small> (without '-')</small>
                <input
                  className={"input-ac"}
                  type="text"
                  name="ic_Num"
                  placeholder="eg. 00103100101"
                  value={ic_Num}
                  onChange={this.changeHandler}
                />
              </label>
              <button
                className="btn-add"
                onClick={this.register}
              >
                Add
              </button>
              
            </form>
          </div>
        </div>
        <hr style={{ borderTop: "1px solid" , margin: "auto",  width: "63%"}}></hr>
      </>
    );
  }
}

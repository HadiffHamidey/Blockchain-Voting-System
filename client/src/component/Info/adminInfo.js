import React, { Component } from "react";

import Navbar from "../Navbar/Navigation";
import NavbarAdmin from "../Navbar/NavigationAdmin";
import NotVerified from "../NotVerified";

import getWeb3 from "../../getWeb3";
import Election from "../../contracts/Election.json";

import "./adminInfo.scss";

class adminInfo extends Component {
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

  contact = async () => {
    setTimeout(()=>{
      this.props.history.push('/contact');
    }, 1500)
  }

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
        
        <div class="resume-wrapper">
        <section class="profile section-padding">
          <div class="container">
            <div class="picture-resume-wrapper">
              <div class="picture-resume">
              <span><img src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png" alt="" /></span>
          <svg version="1.1" viewBox="0 0 350 350">
  
            <defs>
              <filter id="goo">
                <feGaussianBlur in="SourceGraphic" stdDeviation="8" result="blur" />
                <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 21 -9" result="cm" />
              </filter>
            </defs>
      
      
            <g filter="url(#goo)" >  
              
              <circle id="main_circle" class="st0" cx="171.5" cy="175.6" r="130"/>
              
              <circle id="circle" class="bubble0 st1" cx="171.5" cy="175.6" r="122.7"/>
              <circle id="circle" class="bubble1 st1" cx="171.5" cy="175.6" r="122.7"/>
              <circle id="circle" class="bubble2 st1" cx="171.5" cy="175.6" r="122.7"/>
              <circle id="circle" class="bubble3 st1" cx="171.5" cy="175.6" r="122.7"/>
              <circle id="circle" class="bubble4 st1" cx="171.5" cy="175.6" r="122.7"/>
              <circle id="circle" class="bubble5 st1" cx="171.5" cy="175.6" r="122.7"/>
              <circle id="circle" class="bubble6 st1" cx="171.5" cy="175.6" r="122.7"/>
              <circle id="circle" class="bubble7 st1" cx="171.5" cy="175.6" r="122.7"/>
              <circle id="circle" class="bubble8 st1" cx="171.5" cy="175.6" r="122.7"/>
              <circle id="circle" class="bubble9 st1" cx="171.5" cy="175.6" r="122.7"/>
              <circle id="circle" class="bubble10 st1" cx="171.5" cy="175.6" r="122.7"/>

            </g>  
          </svg>
        </div>
      
        <div class="clearfix"></div>
        </div>
      
      <div class="name-wrapper">
        <h1>Mohammad <br/>Hadiff</h1>
      </div>
      <div class="clearfix"></div>
      <div class="contact-info clearfix">
      	<ul class="list-titles">
      		<li>Github</li>
      		<li>Email</li>
      		<li>Phone</li>
      	</ul>
        <ul class="list-content ">
        	<li><a href="https://github.com/Hadip10">Github</a></li> 
        	<li>hadiffhamidey@gmail.com</li>
        	<li>+ (60) - 19780 5280</li> 
        </ul>
        <button style={{marginTop:"50px", marginLeft:"10px"}} className="btn-add" onClick={this.contact}>
          Contact Us
        </button>
      </div>
		</div>
	</section>
  
  <section class="experience section-padding">
  	<div class="container">
  		<h3 class="experience-title">About</h3>
      
      <div class="experience-wrapper">

        
        <div class="job-wrapper clearfix">
        	<div class="experience-title">About Author</div> 
          <div class="company-description">
          	<p>The author of this program is a final year student currently pursuing his studies in Bachelor of Information Technology at Multimedia University, Malaysia. The author is passionate in problem solving and is willing to take risk in learning new things. His goal is to become a professional computer networking and IT professional. This project is author's first time working on with a system involving blockchain technology.</p> 
          </div>
        </div>
        
        
         <div class="job-wrapper clearfix">
        	<div class="experience-title">About Project</div> 
          <div class="company-description">
          	<p>This project is developed based on several tutorials and documentations from the internet. The development process require the use of a few frameworks such as Ganache, truffle, and react to make things easier. The project is still in an early phase and will be updated from time to time. Any contribution is highly appreciated and can be done through the github link given. For any enquiry, the author can be asked through the github profile or the email given. The contact us form is not working because of security reason.</p>  
          </div>
        </div>
        
      </div>
      
  	</div>
  </section>
  
  <div class="clearfix"></div>
</div>
      </>
    );
  }
}


export default adminInfo;
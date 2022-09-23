// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;
import "remix_tests.sol"; // this import is automatically injected by Remix.
import "./remix_accounts.sol";
import "./Election.sol";

contract Electiontest is Election {
   
    Election el;
    address acc0;
    address acc1;
    address acc2;
    address acc3;
   
    function beforeAll () public {
        el = new Election();
        acc0 = TestsAccounts.getAccount(0); 
        acc1 = TestsAccounts.getAccount(1);
        acc2 = TestsAccounts.getAccount(2);
        acc3 = TestsAccounts.getAccount(3);
    }

    function testInitialAdmin() public {
        Assert.equal(getAdmin(), acc0, "owner should be acc0");
    }

    function addCandidate() public {
        addCandidate("Hadip", "CHELSEA", "It is what it is");
        addCandidate("Ikmal", "Man Utd", "It is what it is");
        Assert.equal(getTotalCandidate(), 2, "candidate count should be 2");
    }

    function setElection() public {
        setElectionDetails("Sabah","Best Leader","MMU","now","later");
        Assert.equal(getStart(), true, "Election should have started");
    }

    function verifyVoter() public {
        verifyVoter("Taupiq", "0197867723", "001031142234");
        Assert.equal(getTotalVoter(), 1, "voter count should be 3");
    }

    function voteForCandidate() public {
        vote(1, "now", "0xa23dhdhhcbeaoqnduw82eg82ebd82fd82vf");
        Assert.equal(voteStatus(acc0), true, "Voter already vote");
    }

    function endTheElection() public {
        endElection("now","now");
        Assert.equal(getEnd(), true, "Election should have end");
    }

    function seeResult() public {
        Assert.equal(getCandidateCount(1), 1, "One person vote for");
        Assert.equal(getCandidateCount(0), 0, "No person vote for");
    }

}


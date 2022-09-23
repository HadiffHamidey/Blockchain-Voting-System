// SPDX-License-Identifier: MIT
pragma solidity >=0.4.21 <0.9.0;

contract Election {
    address public admin;
    uint256 candidateCount;
    uint256 voterCount;
    bool start;
    bool end;

    constructor() public {
        // Initilizing default values
        admin = msg.sender;
        candidateCount = 0;
        voterCount = 0;
        start = false;
        end = false;
    }

    function getAdmin() public view returns (address) {
        // Returns account address used to deploy contract (i.e. admin)
        return admin;
    }

    modifier onlyAdmin() {
        // Modifier for only admin access
        require(msg.sender == admin);
        _;
    }
    // Modeling a candidate
    struct Candidate {
        uint256 candidateId;
        string party;
        string header;
        string slogan;
        uint256 voteCount;
    }
    mapping(uint256 => Candidate) public candidateDetails;

    // Adding new candidates
    function addCandidate(string memory _header, string memory _party, string memory _slogan)
        public
        // Only admin can add
        onlyAdmin
    {
        Candidate memory newCandidate =
            Candidate({
                candidateId: candidateCount,
                header: _header,
                party: _party,
                slogan: _slogan,
                voteCount: 0
            });
        candidateDetails[candidateCount] = newCandidate;
        candidateCount += 1;
    }

    // Modeling a Election Details
    struct ElectionDetails {
        string electionLocation;
        string electionTitle;
        string organizationTitle;
    }
    ElectionDetails electionDetails;

    struct ElectionTime {
        string timeStart;
        string timeEnd;
    }
    ElectionTime electionTime;

    function setElectionDetails(
        string memory _electionLocation,
        string memory _electionTitle,
        string memory _organizationTitle,
        string memory _timeStart,
        string memory _timeEnd
    )
        public
        // Only admin can add
        onlyAdmin
    {
        electionDetails = ElectionDetails(_electionLocation, _electionTitle, _organizationTitle);
        electionTime = ElectionTime (_timeStart, _timeEnd);
        start = true;
        end = false;
    }

    // Get Elections details

    function getElectionLocation() public view returns (string memory) {
        return electionDetails.electionLocation;
    }

    function getElectionTitle() public view returns (string memory) {
        return electionDetails.electionTitle;
    }

    function getOrganizationTitle() public view returns (string memory) {
        return electionDetails.organizationTitle;
    }

    function gettimeStart() public view returns (string memory) {
        return electionTime.timeStart;
    }

    function gettimeEnd() public view returns (string memory) {
        return electionTime.timeEnd;
    }

    // Get candidates count
    function getTotalCandidate() public view returns (uint256) {
        // Returns total number of candidates
        return candidateCount;
    }

    // Get voters count
    function getTotalVoter() public view returns (uint256) {
        // Returns total number of voters
        return voterCount;
    }

    // Modeling a voter
    struct Voter {
        address voterAddress;
        string name;
        string phone;
        string Ic;
        string vote_Time;
        string vote_Receipt;
        bool isVerified;
        bool hasVoted;
    }
    address[] public voters; // Array of address to store address of voters
    mapping(address => Voter) public voterDetails;

    // Verify voter
    function verifyVoter(string memory _name, string memory _phone, string memory _ic) public {
        Voter memory newVoter =
            Voter({
                voterAddress: msg.sender,
                name: _name,
                phone: _phone,
                Ic: _ic,
                vote_Time: "",
                vote_Receipt: "",
                hasVoted: false,
                isVerified: true
            });
        voterDetails[msg.sender] = newVoter;
        voters.push(msg.sender);
        voterCount += 1;
    }

    // Vote
    function vote(uint256 candidateId, string memory voteTime, string memory voteReceipt) public {
        require(voterDetails[msg.sender].hasVoted == false);
        require(voterDetails[msg.sender].isVerified == true);
        require(start == true);
        require(end == false);
        candidateDetails[candidateId].voteCount += 1;
        voterDetails[msg.sender].hasVoted = true;
        voterDetails[msg.sender].vote_Time = voteTime;
        voterDetails[msg.sender].vote_Receipt = voteReceipt;
    }

    // End election
    function endElection(
        string memory _timeStart,
        string memory _timeEnd

    ) public onlyAdmin 
    {
        electionTime = ElectionTime(
            _timeStart,
            _timeEnd
        );
        end = true;
        start = false;
    }

    // Get election start and end values
    function getStart() public view returns (bool) {
        return start;
    }

    function getEnd() public view returns (bool) {
        return end;
    }
}

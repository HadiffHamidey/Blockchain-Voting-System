(async () => {
    const account1 = '0xBB1c9bAc509Cf2cae270911b1aA1448028C0d2BD'
    const contractName = 'Election'
    const contractAddress = '0x27F9bF72baC53672B0475F51C4feC9DAc228431C'
    console.log('start')
    
    const metadata = JSON.parse(await remix.call('fileManager', 'getFile', `browser/contracts/artifacts/${contractName}.json`))    
    let contract = new web3.eth.Contract(metadata.abi, contractAddress)
    const accounts = await web3.eth.getAccounts()

    var header = "ikmal"
    var party = "BN"
    var slogan = "it is what it is"

    var name = "hadip"
    var phone = "0197805280"
    var ic = "001031120043"

    var elocation = "sabah"
    var etitle = "best player"
    var otitle = "mmu"
    var tstart = "now"
    var tend = "null"
    //contract.methods.addCandidate(header, party, slogan).send({from: accounts[0]})
    //contract.methods.verifyVoter(name, phone, ic).send({from: accounts[0]})
    //contract.methods.setElectionDetails(elocation, etitle, otitle, tstart, tend).send({from: accounts[0]})

    const voterTotal = await contract.methods.getTotalVoter().call({from: account1})
    console.log(voterTotal)
    const candidateTotal = await contract.methods.getTotalCandidate().call({from: account1})
    console.log(candidateTotal)
    const elStatus = await contract.methods.getStart().call({from: account1})
    console.log(elStatus)
})()
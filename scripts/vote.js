(async () => {
    const account1 = '0xBB1c9bAc509Cf2cae270911b1aA1448028C0d2BD'
    const contractName = 'Election'
    const contractAddress = '0x27F9bF72baC53672B0475F51C4feC9DAc228431C'
    console.log('start')
    
    const metadata = JSON.parse(await remix.call('fileManager', 'getFile', `browser/contracts/artifacts/${contractName}.json`))    
    let contract = new web3.eth.Contract(metadata.abi, contractAddress)
    const accounts = await web3.eth.getAccounts()

    var id = "1"
    var timevote = "now"
    var receipt = "0x123ed44deddcfcrf"

    for (let i = 0; i < 20; i++){
        contract.methods.vote(id, timevote, receipt).send({from: accounts[0]})
    }
})()
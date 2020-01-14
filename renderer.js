// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// No Node.js APIs are available in this process because
// `nodeIntegration` is turned off. Use `preload.js` to
// selectively enable features needed in the rendering
// process.

// const Web3 = require('web3');
// const Tx = require('ethereumjs-tx').Transaction;

/*
var web3 = new Web3(new Web3.providers.HttpProvider(
    'ropsten.infura.io/v3/8f319895fb654c06982fd57850fbcd13'
));
*/

const Web3 = require('web3');
const Tx = require('ethereumjs-tx').Transaction;

const web3 = new Web3('https://ropsten.infura.io/v3/8f319895fb654c06982fd57850fbcd13')
console.log(web3)

const account1 = '0xC05bb52f5D25FE6360ffBF0A42Aad6BB5e7a0CC5';
const privateKey1 = 'acc0f873e116e68183442ab3f8c756b987a34ee7bb0a0a878963f7cd1a0d0475';

const privateKey = Buffer.from(
  'acc0f873e116e68183442ab3f8c756b987a34ee7bb0a0a878963f7cd1a0d0475',
  'hex',
)

function getEthBalance(){
  web3.eth.getBalance(account1, (err, wei) => {
    balance = web3.utils.fromWei(wei, 'ether');
    console.log(balance);
  })

}


const abi =
[
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "string",
				"name": "result",
				"type": "string"
			}
		],
		"name": "allOffers",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "bool",
				"name": "result",
				"type": "bool"
			}
		],
		"name": "isOfferValid",
		"type": "event"
	},
	{
		"constant": false,
		"inputs": [
			{
				"internalType": "string",
				"name": "_sha_256",
				"type": "string"
			}
		],
		"name": "addOffer",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"internalType": "string",
				"name": "_sha_256",
				"type": "string"
			}
		],
		"name": "checkSha256",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [],
		"name": "getAllOffer",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "offers",
		"outputs": [
			{
				"internalType": "string",
				"name": "sha_256",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "createTime",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	}
];

const address = '0x4c18964e67bB76FA6c343Db9eFfaAF12e70C8358';
const contract = new web3.eth.Contract(abi, address);
//console.log(contract);


function addOffer(){
  var toProof="";
  toProof= toProof+document.getElementById('inputFirstName').value;
  toProof= toProof+document.getElementById('inputLasteNname').value;
  toProof= toProof+document.getElementById('inputAddress').value;
  toProof= toProof+document.getElementById('inputNPA').value;
  toProof= toProof+document.getElementById('inputCity').value;
  toProof= toProof+document.getElementById('inputID').value;
  toProof= toProof+document.getElementById('inputValue').value;
  toProof= toProof+document.getElementById('inputDate').value;
  offerPrint=web3.utils.sha3(toProof);
  htmlOut="<h3 style='color:#10903A'>";
  htmlOut=htmlOut+"Empreinte enregistrée avec Succès! : ";
  htmlOut=htmlOut+offerPrint;
  htmlOut=htmlOut+"</h3>";
  document.getElementById('resultPrintCheck').innerHTML=htmlOut;
console.log(offerPrint);
  web3.eth.getTransactionCount(account1, (err, txCount) => {
    // Build the transaction
    const txObject = {
      nonce:    web3.utils.toHex(txCount),
      to:       address,
      gasLimit: web3.utils.toHex(8000000),
      gasPrice: web3.utils.toHex(web3.utils.toWei('100', 'gwei')),
      data: contract.methods.addOffer(offerPrint).encodeABI()
    }

    // Sign the transaction
    const tx = new Tx(txObject,{'chain':'ropsten'});
    tx.sign(privateKey);

    const serializedTx = tx.serialize()
    const raw = '0x' + serializedTx.toString('hex')

    // Broadcast the transaction
    web3.eth.sendSignedTransaction(raw, (err, txHash) => {
      console.log('txHash:', txHash)
      console.log('err:',err);
      // Now go check etherscan to see the transaction!
    })
  });
}

function checkOffer(){
  document.getElementById("printFail").style.display="none";
  document.getElementById("printSuccess").style.display="none";
  var offerPrint=document.getElementById("printOffer").value;
  web3.eth.getTransactionCount(account1, (err, txCount) => {
    // Build the transaction
    const txObject = {
      nonce:    web3.utils.toHex(txCount),
      to:       address,
      gasLimit: web3.utils.toHex(8000000),
      gasPrice: web3.utils.toHex(web3.utils.toWei('100', 'gwei')),
      data: contract.methods.checkSha256(offerPrint).encodeABI()
    }

    // Sign the transaction
    const tx = new Tx(txObject,{'chain':'ropsten'});
    tx.sign(privateKey);

    const serializedTx = tx.serialize()
    const raw = '0x' + serializedTx.toString('hex')

    // Broadcast the transaction
    web3.eth.sendSignedTransaction(raw, (err, txHash) => {
      console.log('txHash:', txHash)
      console.log('err:',err);
      // Now go check etherscan to see the transaction!
    })
  });
  document.getElementById("loadingAnimation").style.display="block";
  setTimeout(function(){
    contract.getPastEvents(
      'isOfferValid',
      {
        fromBlock: 7100087,
        toBlock: 'latest'
      },
      (err, events) => {

        document.getElementById("loadingAnimation").style.display="none";
        var event = events[events.length - 1];
        if(event.returnValues.result==true){
            document.getElementById("printSuccess").style.display="block";
        }
        else{
            document.getElementById("printFail").style.display="block";
        }

       }
    )
}, 20000);


}

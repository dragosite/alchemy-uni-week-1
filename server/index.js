const express = require("express");
const app = express();
const cors = require("cors");
const port = 3042;

const { hexToBytes, toHex, utf8ToBytes, randomPrivateKey } = require("ethereum-cryptography/utils");
const { keccak256 } = require("ethereum-cryptography/keccak");
const secp = require("ethereum-cryptography/secp256k1");

app.use(cors());
app.use(express.json());

// const balances = {
//   "0x1": 100,
//   "0x2": 50,
//   "0x3": 75,
// };

let balances = []
let exampleBalances = []

for( let i = 0; i < 5; i++ ){
  const privateKey = toHex(secp.utils.randomPrivateKey())
  const publicKey = toHex(secp.getPublicKey(privateKey))
  const address = publicKey.slice(-20)
  balances[address] = 100

  exampleBalances.push({
    'address': address,
    'privateKey': privateKey,
    'publicKey': publicKey,
  })
}

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

app.get("/balances", (req, res) => {
  balances = []
  exampleBalances = []

  for( let i = 0; i < 5; i++ ){
    const privateKey = toHex(secp.utils.randomPrivateKey())
    const publicKey = toHex(secp.getPublicKey(privateKey))
    const address = publicKey.slice(-20)
    balances[address] = 100
  
    exampleBalances.push({
      'address': address,
      'privateKey': privateKey,
      'publicKey': publicKey,
    })
  }

  res.send({ exampleBalances });
});

app.post("/send", (req, res) => {
  const { sender, recipient, amount, signature, publicKey } = req.body;

  const messageHash = toHex(keccak256(utf8ToBytes(JSON.stringify(
    {
      sender: sender,
      amount: amount,
      recipient,
    }
  ))))

  console.log('signature', signature);
  console.log('publicKey', publicKey);

  const isSigned = secp.verify(signature, messageHash, publicKey);

  if( !isSigned ){
    res.status(400).send({ message: "Not your account!" });
  }

  setInitialBalance(sender);
  setInitialBalance(recipient);

  if (balances[sender] < amount) {
    res.status(400).send({ message: "Not enough funds!" });
  } else {
    balances[sender] -= amount;
    balances[recipient] += amount;
    res.send({ balance: balances[sender] });
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

function setInitialBalance(address) {
  if (!balances[address]) {
    balances[address] = 0;
  }
}

import server from "./server";
// import { hexToBytes, toHex, utf8ToBytes, randomPrivateKey } from "ethereum-cryptography/utils";
// import { keccak256 } from "ethereum-cryptography/keccak";
// import * as secp from "ethereum-cryptography/secp256k1";

// const randomKey = utils.randomPrivateKey();


function ExampleWallets({ address, setAddress, balance, setBalance, balances, setBalances }) {

  async function loadAddresses(){
    const {
      data: { exampleBalances },
    } = await server.get(`balances`);
    console.log(exampleBalances)
    setBalances(exampleBalances);
  }

  return (
    <div className="container example-wallets">
      <h1>Reset Wallets</h1>

      <input type="submit" className="button" value="Get Example Addresses" onClick={(e) => {
        e.preventDefault();
        loadAddresses();
      } } />

      {balances && balances.map((b) =>
        <ul>
          <li>Address: {b.address}</li>
          <li>Private Key: {b.privateKey}</li>
          <li>Public Key: {b.publicKey}</li>
        </ul>
      )}
    </div>
  );
}

export default ExampleWallets;

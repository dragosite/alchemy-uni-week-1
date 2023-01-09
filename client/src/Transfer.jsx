import { useState } from "react";
import server from "./server";

import { keccak256 } from "ethereum-cryptography/keccak";
import {utf8ToBytes, bytesToHex as toHex} from "ethereum-cryptography/utils";
import * as secp from "ethereum-cryptography/secp256k1";

function Transfer({ address, setBalance }) {
  const [sendAmount, setSendAmount] = useState("");
  const [recipient, setRecipient] = useState("");
  const [privateKey, setPrivateKey] = useState("");

  const setValue = (setter) => (evt) => setter(evt.target.value);
  
  async function transfer(evt) {
    evt.preventDefault();

    const message = {
      sender: address,
      amount: parseInt(sendAmount),
      recipient,
    }

    const messageHash = toHex(keccak256(utf8ToBytes(JSON.stringify(message))))
    const signature = toHex(await secp.sign(messageHash, privateKey));
    const publicKey = toHex(secp.getPublicKey(privateKey))

    try {
      const {
        data: { balance },
      } = await server.post(`send`, {
        sender: address,
        amount: parseInt(sendAmount),
        recipient,
        signature,
        publicKey
      });
      setBalance(balance);
    } catch (ex) {
      alert(ex.response.data.message);
    }
  }

  return (
    <form className="container transfer" onSubmit={transfer}>
      <h1>Send Transaction</h1>

      <label>
        Send Amount
        <input
          placeholder="1, 2, 3..."
          value={sendAmount}
          onChange={setValue(setSendAmount)}
        ></input>
      </label>

      <label>
        Recipient
        <input
          placeholder="Type an address, for example: 0x2"
          value={recipient}
          onChange={setValue(setRecipient)}
        ></input>
      </label>

      <label>
        Private Key (for signature)
        <input
          placeholder="Past your private key"
          value={privateKey}
          onChange={setValue(setPrivateKey)}
        ></input>
      </label>

      <input type="submit" className="button" value="Transfer" />
    </form>
  );
}

export default Transfer;

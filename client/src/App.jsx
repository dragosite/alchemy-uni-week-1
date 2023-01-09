import Wallet from "./Wallet";
import Transfer from "./Transfer";
import ExampleWallets from "./ExampleWallets";
import "./App.scss";
import { useState } from "react";

function App() {
  const [balances, setBalances] = useState([]);
  const [balance, setBalance] = useState(0);
  const [address, setAddress] = useState("");

  return (
    <div className="app">
      <div className="hero">
        <h1>Secured Wallets</h1>
        <p>Exchange currency using secure, keccak ecrypted transactions.</p>
      </div>
      <div className="main">
        <Wallet
          balance={balance}
          setBalance={setBalance}
          address={address}
          setAddress={setAddress}
        />
        <Transfer setBalance={setBalance} address={address} />
      </div>

      <ExampleWallets balances={balances} setBalances={setBalances} />
    </div>
  );
}

export default App;

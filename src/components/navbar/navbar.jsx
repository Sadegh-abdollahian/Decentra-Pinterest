import { useEffect, useState } from "react";
import Identicon from "react-identicons"
import "./navbar.css"
const ethers = require("ethers")


const Navbar = () => {

    const [walletAddress, setWalletAddress] = useState("0x0");

    async function connectWallet() {
        if (typeof window.ethereum !== "undefined") {
          // create the provider
          const provider = new ethers.BrowserProvider(window.ethereum);
          try {
            // connect to wallet using ethers.js
            const signer = await provider.getSigner();
            const _walletAddress = await signer.getAddress();
            setWalletAddress(_walletAddress);
        } catch (err) {
            if (err.message.includes("user rejected action")) {
              console.log("user rejected the request")
            } else {
              console.log(err);
            }
          }
        } else {
          console.log("Please install metamask")
        }
      }

      useEffect(() => {connectWallet()}, [])

    return(
        <nav className="navbar">
            <div className="div-style">
                <h1 className="address-style">Decentra Pinterest</h1>
                <img src={require('./youtube-logo.png')} alt="decentralized-youtube-logo" className="logo-style" />
            </div>
            <div className="div-style">
                <Identicon size="30" string={walletAddress} />
                <p className="address-style">{walletAddress}</p>
            </div>
        </nav>        
    )
}

export default Navbar
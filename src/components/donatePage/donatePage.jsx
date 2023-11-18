import { useState } from "react";
import { contractAddress, abi } from "../main/abi";
import "./donatePage.css"
import { Link } from "react-router-dom";
const { ethers } = require("ethers")

const DonatePage = () => {

    let ethValue = 0
    const [imageId, setImageId] = useState()

    const donate = async (event) => {
        event.preventDefault()
        if (typeof window.ethereum !== "undefined") {
            const provider = new ethers.BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();
            const contract = new ethers.Contract(contractAddress, abi, signer)
            console.log(String(ethValue), parseInt(imageId))
            try {
                const transactionResponse = await contract.donateImageOwner(parseInt(imageId), { value: ethers.parseEther(`${ethValue}`) })
                listenTransactionToMine(transactionResponse, provider)
            } catch (err) {
                console.log(err);
            }
        } else {
            console.log("There is a problem")
        }
    }

    const listenTransactionToMine = (transactionResponse, provider) => {
        console.log(`Mining ${transactionResponse.hash}`)
        try {
            provider.once(transactionResponse.hash, (transactionReceipt) => {
                console.log(`completed with ${transactionReceipt.confirmations} confirmations`)
                console.log("Done")
            })
        } catch (err) {
            
        }
    }

    const getOwner = async (event) => {
        if (typeof window.ethereum !== "undefined") {
            const provider = new ethers.BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();
            const contract = new ethers.Contract(contractAddress, abi, signer)
            if (event.target.value <= await contract.getImageCount()) {
                try {
                    const image = await contract.getImageFromId(event.target.value)
                    document.querySelector("#owner-address").innerHTML = "owner : " + image[2]
                    setImageId(image[0])
                } catch (err) {
                    if (err.toString().includes("invalid BigNumberish string")) {
                        document.querySelector("#owner-address").innerHTML = "owner : Invalid id"
                    } else {
                        console.log(err)
                    }
                }
            }
        } else {
            console.log("There is a problem")
        }
    }

    const getEthValue = async (event) => {
        if (typeof window.ethereum !== "undefined") {
            ethValue = event.target.value
            console.log(ethValue)
        } else {
            console.log("There is a problem")
        }
    }

    return(
        <div>
            <form className="container">
                <input onChange={getOwner} type="number" placeholder="Enter id" className="input-style"/>
                <input onChange={getEthValue} type="text" placeholder="Amount as ETH" className="input-style"/>
                <h4 style={{ marginTop: "40px" }} id="owner-address">owner : </h4>
                <button onClick={donate} className="btn-style">DONATE !</button>
                <Link to="/" style={{ textDecoration: 'none' }}>
                    <button className="btn-style">HOME</button>
                </Link>
            </form>
        </div>
    )
}

export default DonatePage;
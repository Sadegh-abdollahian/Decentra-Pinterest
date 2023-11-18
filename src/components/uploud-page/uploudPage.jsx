import "./uploudPage.css"
import { Link } from "react-router-dom"
import { abi, contractAddress } from "../main/abi"
import { useState } from "react"
const { ethers } = require("ethers")

const UploudPage = () => {

    const [hash, setHash] = useState("")
    const [description, setDescription] = useState("")

    const uploadImageClient = async event => {
        event.preventDefault()
        if (hash !== "" && description !== "" && typeof window.ethereum !== "undefined") {
            const provider = new ethers.BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();
            const contract = new ethers.Contract(contractAddress, abi, signer)
            try {
                const transactionResponse = await contract.uploadImage(hash, description)
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

    const setHashByInput = event => {
        setHash(event.target.value)
    }

    const setDescriptionByInput = event => {
        setDescription(event.target.value)
    }

    return(
        <div>
            <form className="container">
                <input onChange={setHashByInput} type="text" placeholder="descriptoin" className="input-style" id="hash"/>
                <input onChange={setDescriptionByInput} type="text" placeholder="hash" className="input-style" id="desc"/>
                <button onClick={uploadImageClient} className="btn-style">SUBMIT</button>
                <Link to="/" style={{ textDecoration: 'none' }}>
                    <button className="btn-style">HOME</button>
                </Link>
            </form>
        </div>
    )
}

export default UploudPage

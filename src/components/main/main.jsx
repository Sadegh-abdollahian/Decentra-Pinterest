import "./main.css"
import { abi, contractAddress } from "./abi"
import { Link } from "react-router-dom"
import { useEffect } from "react";
const ethers = require("ethers")

const Main = () => {
    
    const loadImages = async () => {
        // create contract
        const provider = new ethers.BrowserProvider(window.ethereum)
        const signer = await provider.getSigner()
        const decentraPinterest = new ethers.Contract(contractAddress, abi, signer)
        // set imageCount
        const _imageCount = parseInt(await decentraPinterest.getImageCount())
        // create element for each image
        for (let i = 1; i < _imageCount + 1; i++) {
            const image = await decentraPinterest.getImageFromId(i)
            const address = image[0]
            const description = image[3]
            const hash = image[4]
            const donatedAmount = image[1]
            if (address.toString() !== "0x0000000000000000000000000000000000000000" && hash.trim() !== "") {
                document.querySelector("main").insertAdjacentHTML("afterbegin", `<div class="img-container"><div class="img-id-style"><p>${address}</p></div><img src="https://${hash}.ipfs.4everland.io/" alt="00" class="img-style"><p class="img-description">${description}</p><p class="img-donatedAmount">Donated amount : ${parseInt(donatedAmount) / 1e18} ETH</p></div>`)
            }
        }
    }
    
    useEffect(() => {loadImages()}, [])
    
    return(
        <>
            <Link to="/uploud" style={{ textDecoration: 'none' }}>
                <button className="uploud-btn">UPLOUD IMAGE</button>
            </Link>
            <Link to="/donate" style={{ textDecoration: "none" }}>
                <button className="donate-btn">DONATE</button>
            </Link>
            <main className="main-style">
                {/* <div className="img-container">
                    <div className="img-id-style">
                        <p>1</p>
                    </div>
                    <img src={`https://bafkreiaeqpic6v3dkxk4lqeye4jxjaljnb4l2ka73bl2pmwn4suwvh5fau.ipfs.4everland.io/`} className="img-style" />
                    <p className="img-description">Lorem ipsum dolor sit amet consectetur</p>
                    <p className="img-tipAmount">Tip amount : 0 ETH</p>
                </div> */}
            </main>
        </>
    )
}

export default Main
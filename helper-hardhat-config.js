const networkConfig = {
    80001: {
        name: "mumbai"
    },
    11155111: {
        name: "sepolia"
    },
    1337: {
        name: "ganache"
    }
}

const developmentchains = ["localhost", "hardhat"]

module.exports = {
    networkConfig,
    developmentchains,
}
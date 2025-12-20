const { ethers } = require("hardhat");

async function main() {
    // Actual addresses from user's test
    const subscriberAddr = "0x1a61644386d09c15113f77440ba79488c1a1a92d";
    const creatorAddr = "0x9648D38044DFEe2E9E3EF9f4d26bc2a7751874Ff";

    console.log("Checking subscription status...");
    console.log("Subscriber:", subscriberAddr);
    console.log("Creator:", creatorAddr);

    const contractAddress = "0x1c41680a372C06A67ff0B247Adf687bF548C714F";
    const StrafhegySocial = await ethers.getContractFactory("StrafhegySocial_uint32");
    const contract = StrafhegySocial.attach(contractAddress);

    // Check subscription expiry
    const expiry = await contract.subscriptionExpiry(creatorAddr, subscriberAddr);
    const now = Math.floor(Date.now() / 1000);

    console.log("\n=== Subscription Status ===");
    console.log("Expiry timestamp:", expiry.toString());
    console.log("Current timestamp:", now);
    console.log("Expiry date:", new Date(Number(expiry) * 1000).toLocaleString());
    console.log("Is active?", Number(expiry) > now);
    console.log("Time remaining:", Number(expiry) > now ? `${Math.floor((Number(expiry) - now) / 60)} minutes` : "EXPIRED");

    // Check creator profile
    const isActive = await contract.creatorActive(creatorAddr);
    const price = await contract.monthlyPriceWei(creatorAddr);

    console.log("\n=== Creator Profile ===");
    console.log("Is active?", isActive);
    console.log("Monthly price:", ethers.formatEther(price), "ETH");

    // Check position count
    const posCount = await contract.getPositionCount(creatorAddr);
    console.log("\n=== Positions ===");
    console.log("Position count:", posCount.toString());
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });

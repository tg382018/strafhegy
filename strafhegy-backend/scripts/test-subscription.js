
const { ethers } = require("hardhat");


async function main() {
    // Get signers from hardhat config (loaded from .env)
    const signers = await ethers.getSigners();
    const creator = signers[0];
    const subscriber = signers.length > 1 ? signers[1] : signers[0];

    console.log("Testing with accounts:");
    console.log("Creator:", creator.address);
    console.log("Subscriber:", subscriber.address);

    // Contract address from latest deployment
    const contractAddress = "0xf44d40a8115CA67e88d036bBD9712C1275c349A4";
    const StrafhegySocial = await ethers.getContractFactory("StrafhegySocial_uint32");
    const contract = StrafhegySocial.attach(contractAddress);

    // 1. Creator: Upsert Profile
    console.log("\n1. Creator: Upserting Profile...");
    const price = ethers.parseEther("0.005");
    const tx1 = await contract.connect(creator).upsertProfile(price, true);
    await tx1.wait();
    console.log("Profile upserted.");

    // 2. Creator: Add Position (Mocking encrypted input for testnet is hard without fhevm instance, skipping actual addPosition for CLI test unless we use fhevmjs)
    // However, the user's issue is specifically about subscription failing.
    // We can test subscription even if there are no positions (it should just succeed and grant nothing).
    // If we want to test with positions, we need to generate valid handles.
    // For this quick test, let's verify subscription transaction succeeds.

    // 3. Subscriber: Subscribe
    console.log("\n2. Subscriber: Subscribing...");
    const tx2 = await contract.connect(subscriber).subscribe(creator.address, { value: price, gasLimit: 10000000 });
    console.log("Transaction sent:", tx2.hash);
    await tx2.wait();
    console.log("Subscription successful!");

    // 4. Verify Subscription
    const expiry = await contract.subscriptionExpiry(creator.address, subscriber.address);
    console.log("Subscription Expiry:", expiry.toString());
    const now = Math.floor(Date.now() / 1000);
    if (Number(expiry) > now) {
        console.log("VERIFICATION PASSED: Subscription is active.");
    } else {
        console.error("VERIFICATION FAILED: Subscription not active.");
    }

    // 5. Self-Subscription Test
    console.log("\n3. Creator: Self-Subscribing (Testing Refund Logic)...");
    try {
        const tx3 = await contract.connect(creator).subscribe(creator.address, { value: price, gasLimit: 10000000 });
        console.log("Transaction sent:", tx3.hash);
        await tx3.wait();
        console.log("Self-subscription successful!");

        const selfExpiry = await contract.subscriptionExpiry(creator.address, creator.address);
        console.log("Self-Subscription Expiry:", selfExpiry.toString());
        if (Number(selfExpiry) > now) {
            console.log("VERIFICATION PASSED: Self-Subscription is active.");
        }
    } catch (e) {
        console.error("Self-subscription failed:", e);
    }
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });

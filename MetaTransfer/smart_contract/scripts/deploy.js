
import hre from "hardhat"
const main = async () => {


  const transactions = hre.ethers.deployContract("Transactions");

  (await transactions).getAddress().then((x) => console.log(x));

  console.log("Contract deployed to: " + (await transactions).getAddress().then((x) => console.log(x)));

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
const runMain = async () => {
  try {
    await main()
    process.exit(0)
  } catch (error) {
    console.error(error)
    process.exit(1)
  }
}

runMain();

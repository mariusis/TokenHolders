import ContractSingleton from "../utils/ContractSingleton";

/**
 * Calls the balanceOf() method of the contract to get the balance of the address.
 * @param {string} address - The wallet address to check the balance of.
 * @returns {Promise<BigNumber>} - The balance of the address.
 */

export default async function checkUserBalance(address: string) {
  //Intitialize the contract
  const contract = ContractSingleton.getInstance();

  const balance = await contract.balanceOf(address); //Call to the balanceOf() method of the contract to get the balance of the address

  return balance;
}

import ContractSingleton from "../utils/ContractSingleton";

/**
 * A service that checks the token balance of a given address in the contract.
 * @param {string} address - The address of the wallet to check the balance for.
 * @returns {Promise<bigint>} - The balance of the given address.
 */
export default async function checkUserBalance(
  address: string
): Promise<bigint> {
  // Initialize the contract
  const contract = ContractSingleton.getInstance();

  // Call to the balanceOf() method of the contract to get the balance of the address
  const balance = await contract.balanceOf(address);

  return balance;
}

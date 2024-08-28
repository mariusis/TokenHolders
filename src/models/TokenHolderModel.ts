export default interface TokenHolder {
  id?: number; // id is optional as it will be auto-generated
  address: string;
  balance: number;
}

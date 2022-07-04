export interface IWallet {
  config: WalletConfig;
  transactions: Transaction[];
  balance?: Balance;

  refreshBalance(): Promise<IWallet>;
  refreshTransactions(): Promise<IWallet>;
}

interface IConstructor<T> {
  new (...args: any[]): T;
}

export interface Balance {
  incoming: number;
  outgoing: number;

  // Is not delivered by tatum but would be cool to have
  unconfirmedBalance?: number;
  confirmedBalance?: number;
}

export interface Transaction {
  blockNumber: number;
  fee: number;
  hash: string;
  hex: string;
  index: number;
  inputs: Input[];
  locktime: number;
  outputs: Output[];
  size: number;
  time: number;
  version: number;
  vsize: number;
  weight: number;
  witnessHash: string;
}

export interface Input {
  prevout: Prevout;
  sequence: number;
  script: string;
  coin: Coin;
}

export interface Coin {
  version: number;
  height: number;
  value: number;
  script: string;
  address: string;
  coinbase: boolean;
}

export interface Prevout {
  hash: string;
  index: number;
}

export interface Output {
  value: number;
  script: string;
  address: string;
}

export interface WalletConfig {
  symbol: string;
  name: null | string;
  chain: string;
  address: string;
  publicKey: null | Buffer;
  isTestnet: boolean;
}

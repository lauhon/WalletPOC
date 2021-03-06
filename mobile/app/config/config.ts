import * as bitcoin from "der-bitcoinjs-lib";
import "shim";

const Network: "TEST" | "Main" = "TEST";

interface Config {
  BCNetwork: bitcoin.Network;
}

export const config: Config = {
  BCNetwork:
    Network === "TEST" ? bitcoin.networks.testnet : bitcoin.networks.bitcoin,
};

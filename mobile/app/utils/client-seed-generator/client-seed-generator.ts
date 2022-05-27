import "@Shim";
import * as bitcoin from "bitcoinjs-lib";

export default class ClientSeedGenerator  {

    //if string convert always hex
    private userSeed: Buffer | undefined;

    public constructor() {
    }

    public setUserSeed(us: Buffer) {
        this.userSeed = us
    }

    //generate new UserSeed and return it
    public receiveUserSeed(): Buffer {
        if(!this.userSeed)
            this.userSeed = Buffer.from(bitcoin.ECPair.makeRandom().privateKey as Buffer);
        return this.userSeed
    }

    public receiveUserSeedAsString(): string {
        return this.receiveUserSeed().toString('hex')
    }

    //return already existing UserSeed
    public getUserSeed(): Buffer | undefined {
        return this.userSeed
    }
    //return already existing UserSeed as string
    public getUserSeedAsString(): string | undefined {
        return this.userSeed?.toString('hex')
    }
}
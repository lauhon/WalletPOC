import uuid from 'react-native-uuid';
const createHmac = require('create-hmac');

//master seed - paper
const masterSeed = '000102030405060708090a0b0c0d0e0f';
//masterPrivate Key with the seed above - derived from masterSeed (fromSeed())
const masterPrivateKey = 'e8f32e723decf4051aefac8e2c93c9c5b214313817cdb01a1494b917c8436b35';

export class ServerSeedGenerator  {

    private masterPrivateKey: Buffer;
    private serverSeed: Buffer | undefined;
    private userUuid: string | undefined;

    public constructor(mpk: Buffer) {
        this.masterPrivateKey = mpk
    }

    public setUserUuid(uuid: string) {
        this.userUuid = uuid
    }
    public getUserUuid() :string | undefined {
        return this.userUuid
    }

    //generate new ServerSeed and return it
    public receiveServerSeed(): Buffer {
        if(!this.userUuid)
            this.userUuid = splitUuid(uuid.v4().toString())
        this.serverSeed = hmacSHA512(Buffer.from(this.userUuid), Buffer.from(this.masterPrivateKey as Buffer).toString('hex'))
        return this.serverSeed
    }

    //return already existing ServerSeed
    public getServerSeed(): Buffer | undefined{
        return this.serverSeed;
    } 
    //return already existing ServerSeed as string
    public getServerSeedAsString(): string | undefined{
        return this.serverSeed?.toString('hex');
    }
}
  
function splitUuid(uuid: String): string {
    const uuidNew = uuid.split('-');
    return uuidNew[0]+uuidNew[1]+uuidNew[2]+uuidNew[3]+uuidNew[4];
}

function hmacSHA512(key: Buffer, data: String): Buffer {
    return createHmac('sha512', key)
        .update(data)
        .digest();
}
import React, { useState } from 'react';
import {Text, useColorScheme, View, Pressable, Alert} from 'react-native';
import {  fromBase58, fromSeed,   } from 'bip32';
import uuid from 'react-native-uuid';
const createHmac = require('create-hmac');
import "@Shim";
import * as bitcoin from "bitcoinjs-lib";

import { getStyles } from './create-wallet.styles';

// const bitcoin = require("bitcoinjs-lib");

//master seed - paper
const masterSeed = '000102030405060708090a0b0c0d0e0f';
//uuid - server/client
//const uuid = 'e4a1dfc6-88de-408d-a00e-14672d004a5d';

const uuidTest = 'adf21dea-30d2-49b6-93df-51d999fc718d'
const masterSeedTest = '000102030405060708090a0b0c0d0e0f';
const userSeedTest = 'E9873D79C6D87DC0FB6A5778633389';

function getAddress(node: any, network?: any): string {
  return bitcoin.payments.p2pkh({ pubkey: node.publicKey, network }).address!;
}

function splitUuid(uuid: string): string {
  const uuidNew = uuid.split('-');
  return uuidNew[0]+uuidNew[1]+uuidNew[2]+uuidNew[3]+uuidNew[4];
}

function hmacSHA512(key: Buffer, data: string): Buffer {
  return createHmac('sha512', key)
      .update(data)
      .digest();
}

const CreateWallet = () => {
  const styles = getStyles(useColorScheme() === 'dark')

  const [masterRoot, SetMasterRoot] = useState<String>();
  const [serverSeed, SetServerSeed] = useState<String>();
  const [userSeed, SetUserSeed] = useState<String>();
  const [combinedSeed, SetCombinedSeed] = useState<String>();
  const [clientRoot, SetClientRoot] = useState<String>();
  const [uuidSeed, SetUUID] = useState<String>();

  const createAddress = () => {

    //master root - server - safe
    const masterRoot = fromSeed(
      Buffer.from(
        masterSeedTest,
        'hex',
      ),
    );
    SetMasterRoot(masterRoot.toBase58())

    const uuid4 = uuid.v4().toString()
    SetUUID(uuid4)

    console.log(splitUuid(uuid4))


    //serverSeed - server
    const serverSeed = hmacSHA512(Buffer.from(splitUuid(uuidTest)), Buffer.from(masterRoot.privateKey as Buffer).toString('hex'))
    //const child1 = masterRoot.derivePath(splitUuid(uuid.v4().toString()))
    //const serverSeed = Buffer.from(child1.privateKey as Buffer).toString('hex')+Buffer.from(child1.chainCode).toString('hex');
    SetServerSeed(serverSeed.toString('hex'))

    //userSeed - client
    const keyPair = bitcoin.ECPair.makeRandom();
    //const userSeed = Buffer.from(keyPair.privateKey as Buffer).toString('hex');
    const userSeed = userSeedTest
    SetUserSeed(userSeed)

    //combined user/server-Seed - client at initial setup
    //const combinedSeed = hmacSHA512(Buffer.from('Bitcoin seed', 'utf8'), userSeed+serverSeed);
    //combine with threshold signature
    const combinedSeed = hmacSHA512(serverSeed, userSeed);
    SetCombinedSeed(Buffer.from(combinedSeed as Buffer).toString('hex'));
        

    //client extended private key
    const clientRoot = fromSeed(
      Buffer.from(
        Buffer.from(combinedSeed as Buffer).toString('hex'),
        'hex',
      ),
    );
    SetClientRoot(clientRoot.toBase58())

    Alert.alert("user acc address: " + getAddress(clientRoot))
  }

  return( 
    <View style={styles.container}>
        <Text style={styles.text}>MasterSeed: {masterSeed}</Text>
        <Pressable 
          onPress={() => createAddress()}
          style={styles.button}>
          <Text style={styles.buttonText}>Receive Address</Text>
        </Pressable>
      {masterRoot && <Text>masterroot xpriv: {masterRoot} {'\n'} </Text>}
      {uuidSeed && <Text>uuid: {uuidSeed}</Text>}
      {serverSeed && <Text>serverSeed: {serverSeed} {'\n'} </Text>}
      {userSeed && <Text>userSeed: {userSeed} {'\n'} </Text>}
      {combinedSeed && <Text>combinedSeed: {combinedSeed} {'\n'} </Text>}
      {clientRoot && <Text>clientroot xpriv: {clientRoot} {'\n'} </Text>}

    </View>
  );
};

export default CreateWallet;

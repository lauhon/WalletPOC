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

function getAddress(node: any, network?: any): string {
  return bitcoin.payments.p2pkh({ pubkey: node.publicKey, network }).address!;
}

function splitUuid(uuid: string): string {
  const uuidNew = uuid.split('-');
  var dec0 = parseInt(uuidNew[0],16).toString();
  var dec1 = parseInt(uuidNew[1],16).toString();
  var dec2 = parseInt(uuidNew[2],16).toString();
  var dec3 = parseInt(uuidNew[3],16).toString();
  return dec1+"'/"+dec2+"'/"+dec3+"'";
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

  const createAddress = () => {

    //master root - server
    const masterRoot = fromSeed(
      Buffer.from(
        masterSeed,
        'hex',
      ),
    );
    SetMasterRoot(masterRoot.toBase58())

    //serverSeed - server
    const child1 = masterRoot.derivePath(splitUuid(uuid.v4().toString()))
    const serverSeed = Buffer.from(child1.privateKey as Buffer).toString('hex')+Buffer.from(child1.chainCode).toString('hex');
    SetServerSeed(serverSeed)

    //userSeed - client
    const keyPair = bitcoin.ECPair.makeRandom();
    const userSeed = Buffer.from(keyPair.privateKey as Buffer).toString('hex');
    SetUserSeed(userSeed)

    //combined user/server-Seed - client at initial setup
    const combinedSeed = hmacSHA512(Buffer.from('Bitcoin seed', 'utf8'), userSeed+serverSeed);
    SetCombinedSeed(Buffer.from(combinedSeed as Buffer).toString('hex'));
        

    //client extended private key
    const clientRoot = fromSeed(
      Buffer.from(
        Buffer.from(combinedSeed as Buffer).toString('hex'),
        'hex',
      ),
    );
    SetClientRoot(clientRoot.toBase58())

    Alert.alert("user acc address: " + getAddress(clientRoot.derivePath("m/44'/0'/0'/0'/0'")))
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
      {serverSeed && <Text>serverSeed: {serverSeed} {'\n'} </Text>}
      {userSeed && <Text>userSeed: {userSeed} {'\n'} </Text>}
      {combinedSeed && <Text>combinedSeed: {combinedSeed} {'\n'} </Text>}
      {clientRoot && <Text>clientroot xpriv: {clientRoot} {'\n'} </Text>}

    </View>
  );
};

export default CreateWallet;

import React, { useState } from 'react';
import {Text, useColorScheme, View, Pressable, Alert} from 'react-native';
import {  fromBase58, fromSeed,   } from 'bip32';
const createHmac = require('create-hmac');
import "@Shim";
import * as bitcoin from "bitcoinjs-lib";

import { getStyles } from './create-wallet.styles';
import {ServerSeedGenerator} from '../../utils/server-seed-generator/server-seed-generator';
import ClientSeedGenerator from '../../utils/client-seed-generator/client-seed-generator';



//master seed - paper
const masterSeed = '000102030405060708090a0b0c0d0e0f';
//masterPrivate Key with the seed above - derived from masterSeed (fromSeed())
const masterPrivateKey = 'e8f32e723decf4051aefac8e2c93c9c5b214313817cdb01a1494b917c8436b35';

function getAddress(node: any, network?: any): string {
  return bitcoin.payments.p2pkh({ pubkey: node.publicKey, network }).address!;
}

function hmacSHA512(key: Buffer, data: string): Buffer {
  return createHmac('sha512', key)
      .update(data)
      .digest();
} 

const CreateWallet = () => {
  const styles = getStyles(useColorScheme() === 'dark')

  const createAddress = () => {

    const serverSeedGen =  new ServerSeedGenerator(Buffer.from(masterPrivateKey, 'hex'))

    const clientSeedGen = new ClientSeedGenerator();

    //combined user/server-Seed - client at initial setup
    //const combinedSeed = hmacSHA512(Buffer.from('Bitcoin seed', 'utf8'), userSeed+serverSeed);
    //combine with threshold signature
    const combinedSeed = hmacSHA512(serverSeedGen.receiveServerSeed(), clientSeedGen.receiveUserSeedAsString());        

    //client extended private key
    const clientRoot = fromSeed(
      Buffer.from(
        Buffer.from(combinedSeed as Buffer).toString('hex'),
        'hex',
      ),
    );

    console.log("serverSeed: " + serverSeedGen.getServerSeedAsString())
    console.log("clientSeed: " + clientSeedGen.getUserSeedAsString())
    console.log("uuid: " + serverSeedGen.getUserUuid())
    console.log("address: " + getAddress(clientRoot))
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
    </View>
  );
};

export default CreateWallet;

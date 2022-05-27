import React, { useState } from 'react';
import {Text, useColorScheme, View, Pressable, Alert, TextInput} from 'react-native';
import {  fromBase58, fromSeed,   } from 'bip32';
const createHmac = require('create-hmac');
import "@Shim";
import * as bitcoin from "bitcoinjs-lib";

import { getStyles } from './import-wallet.styles';

import {ServerSeedGenerator} from '../../utils/server-seed-generator/server-seed-generator';
import ClientSeedGenerator from '../../utils/client-seed-generator/client-seed-generator';

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

  const [masterSeed, onChangeMasterSeed] = React.useState("MasterSeed");
  const [uuid, onChangeUUID] = React.useState("UUID");
  const [userSeed, onChangeUserSeed] = React.useState("UUID");

  
  const recoverAddress = () => {

    //master root - server - safe
    const masterRoot = fromSeed(
      Buffer.from(
        masterSeed,
        'hex',
      ),
    );

    const serverSeedGen =  new ServerSeedGenerator(Buffer.from(masterRoot.privateKey as Buffer))
    serverSeedGen.setUserUuid(uuid)
    const clientSeedGen = new ClientSeedGenerator();
    clientSeedGen.setUserSeed(Buffer.from(userSeed,'hex'))

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
        <Text>MasterSeed - hard save at server</Text>
        <TextInput style={styles.input} onChangeText={onChangeMasterSeed} />
        <Text>UUID - saved at user</Text>
        <TextInput style={styles.input} onChangeText={onChangeUUID} />
        <Text>UserSeed - save at user</Text>
        <TextInput style={styles.input} onChangeText={onChangeUserSeed} />
        <Pressable 
          onPress={() => recoverAddress()}
          style={styles.button}>
          <Text style={styles.buttonText}>Recover Address</Text>
        </Pressable>
    </View>
  );
};

export default CreateWallet;

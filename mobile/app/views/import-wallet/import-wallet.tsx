import React, { useState } from 'react';
import {Text, useColorScheme, View, Pressable, Alert, TextInput} from 'react-native';
import {  fromBase58, fromSeed,   } from 'bip32';
import uuid from 'react-native-uuid';
const createHmac = require('create-hmac');
import "@Shim";
import * as bitcoin from "bitcoinjs-lib";

import { getStyles } from './import-wallet.styles';

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

  const [masterSeed, onChangeMasterSeed] = React.useState("MasterSeed");
  const [uuid, onChangeUUID] = React.useState("UUID");
  const [userSeed, onChangeUserSeed] = React.useState("UUID");
  
  

  const [masterRoot, SetMasterRoot] = useState<String>();
  const [serverSeed, SetServerSeed] = useState<String>();
  const [combinedSeed, SetCombinedSeed] = useState<String>();
  const [clientRoot, SetClientRoot] = useState<String>();

  const recoverAddress = () => {


    //master root - server - safe
    const masterRoot = fromSeed(
      Buffer.from(
        masterSeed,
        'hex',
      ),
    );
    SetMasterRoot(masterRoot.toBase58())

    //serverSeed - server
    const serverSeed = hmacSHA512(Buffer.from(splitUuid(uuid)), Buffer.from(masterRoot.privateKey as Buffer).toString('hex'))
    //const child1 = masterRoot.derivePath(splitUuid(uuid.v4().toString()))
    //const serverSeed = Buffer.from(child1.privateKey as Buffer).toString('hex')+Buffer.from(child1.chainCode).toString('hex');
    SetServerSeed(serverSeed.toString('hex'))

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
      {masterRoot && <Text>masterroot xpriv: {masterRoot} {'\n'} </Text>}
      {serverSeed && <Text>serverSeed: {serverSeed} {'\n'} </Text>}
      {combinedSeed && <Text>combinedSeed: {combinedSeed} {'\n'} </Text>}
      {clientRoot && <Text>clientroot xpriv: {clientRoot} {'\n'} </Text>}

    </View>
  );
};

export default CreateWallet;

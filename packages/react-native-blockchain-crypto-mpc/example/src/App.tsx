import { Buffer } from 'buffer';
import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import {
  getPublicKey,
  getResultDeriveBIP32,
  getSignature,
  verifySignature,
} from 'react-native-blockchain-crypto-mpc';
import styles from './App.styles';
import {
  deriveBIP32,
  generateEcdsa,
  importSecret,
  signEcdsa,
} from './examples';
import { getApi } from './examples/shared';

export default function App() {
  const messageToSign = 'sL1nVFODesKwbLVLu3UkR0Yfd06/+bE2fSXbe9tHWUQ=';
  const secret =
    '153649e88ae8337f53451d8d0f4e6fd7e1860620923fc04192c8abc2370b68dc';

  const [share, setShare] = useState('');
  const [publicKey, setPublicKey] = useState('');
  const [signature, setSignature] = useState('');
  const [verifyLocal, setVerifyLocal] = useState<boolean>();
  const [verifyServer, setVerifyServer] = useState<any>();
  const [importedShare, setImportedShare] = useState('');
  const [derivedShare, setDerivedShare] = useState('');
  const [derivedFromShare, setDerivedFromShare] = useState('');

  // const [generatedSecretShare, setGeneratedSecretShare] = useState('');

  useEffect(() => {
    const onStartUp = async () => {
      // --- Start Generating Keypair
      const generatedShare = await generateEcdsa();
      setShare(generatedShare);
      setPublicKey(await getPublicKey(generatedShare));

      // --- Start signing a message
      const signContext = await signEcdsa(messageToSign, generatedShare);

      const signatureResult = await getSignature(signContext);
      setSignature(signatureResult);

      // --- Start validating a signature
      setVerifyLocal(
        await verifySignature(
          new Uint8Array(Buffer.from(messageToSign, 'base64')),
          new Uint8Array(Buffer.from(signatureResult, 'base64')),
          generatedShare
        )
      );

      const response = await fetch(getApi('http') + '/verify', {
        method: 'POST',
        body: JSON.stringify({
          message: messageToSign,
          signature: signatureResult,
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      setVerifyServer(JSON.stringify(await response.json()));

      // --- Start generating a random secret
      // const randomSecretContext = await generateSecret();

      // setGeneratedSecretShare(await getShare(randomSecretContext));

      // --- Start importing a secret from another wallet
      const shareFromSecret = await importSecret(secret);

      setImportedShare(shareFromSecret);

      // --- Start deriving a keypair from the imported wallet
      const deriveContext = await deriveBIP32(shareFromSecret, 0, false);

      const derived = await getResultDeriveBIP32(deriveContext);

      setDerivedShare(derived);

      const deriveContext2 = await deriveBIP32(derived, 44, true);

      setDerivedFromShare(await getResultDeriveBIP32(deriveContext2));
    };

    onStartUp();
  }, []);

  return (
    <ScrollView>
      <View style={styles.container}>
        <View style={groupStyle}>
          <Text>Client side Key Share: {share.slice(0, 23)}</Text>
          <Text>Client side Public Key: {publicKey}</Text>
        </View>

        <View style={groupStyle}>
          <Text>Message to sign: {messageToSign}</Text>
          <Text>Signature: {signature}</Text>
        </View>

        <View style={groupStyle}>
          <Text>OK Local: {`${verifyLocal}`}</Text>
          <Text>OK Server: {`${verifyServer}`}</Text>
        </View>

        {/* <View style={groupStyle}>
          <Text>
            Secret Share generated from Random Secret : {generatedSecretShare}
          </Text>
        </View> */}

        <View style={groupStyle}>
          <Text>Importing Secret: {secret}</Text>
          <Text>Imported Share: {importedShare.slice(0, 23)}</Text>
        </View>

        <View style={groupStyle}>
          <Text>Derived Share: {derivedShare.slice(0, 23)}</Text>
          <Text>Derived From Share: {derivedFromShare.slice(0, 23)}</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const groupStyle = {
  borderBottomColor: 'black',
  borderBottomWidth: StyleSheet.hairlineWidth,
  paddingBottom: 10,
  marginBottom: 10,
};

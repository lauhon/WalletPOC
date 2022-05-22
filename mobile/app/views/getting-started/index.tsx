import {NativeStackScreenProps} from '@react-navigation/native-stack';
import React from 'react';
import {
  Alert,
  Button,
  StyleProp,
  Text,
  TextStyle,
  useColorScheme,
  View,
} from 'react-native';

import "@Shim";
const bitcoin = require("bitcoinjs-lib");
const keyPair = bitcoin.ECPair.makeRandom();
const { address } = bitcoin.payments.p2pkh({ pubkey: keyPair.publicKey });
Alert.alert("jow lautsch, wenn des ausschaut wie a adresse is leiwond --> " , address);

type Props = NativeStackScreenProps<NavigationRoutes, 'GettingStarted'>;

const GettingStarted = ({navigation}: Props) => {
  const isDarkMode = useColorScheme() === 'dark';

  const textStyle: StyleProp<TextStyle> = {
    color: isDarkMode ? '#fff' : '#000',
    fontWeight: '700',
    textAlign: 'center',
  };

  return (
    <View>
      <Text style={textStyle}>Welcome to Secure Wallet</Text>
      <Button
        onPress={() => navigation.navigate('CreateWallet')}
        title="Create Wallet"
      />
    </View>
  );
};

export default GettingStarted;

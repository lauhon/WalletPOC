import {NativeStackScreenProps} from '@react-navigation/native-stack';
import React from 'react';
import {
  Alert,
  Button,
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  useColorScheme,
  View,
} from 'react-native';

import {getStyles} from './getting-started.styles'

type Props = NativeStackScreenProps<NavigationRoutes, 'GettingStarted'>;

const GettingStarted = ({navigation}: Props) => {
  const styles = getStyles(useColorScheme() === 'dark')

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Welcome to Secure Wallet</Text>
      <Pressable 
        onPress={() => navigation.navigate('CreateWallet')}
        style={styles.button}>
        <Text style={styles.buttonText}>Create Wallet</Text>
      </Pressable>
      <Pressable 
        onPress={() => navigation.navigate('ImportWallet')}
        style={styles.button}>
        <Text style={styles.buttonText}>Import Wallet</Text>
      </Pressable>
    </View>
  );
};

export default GettingStarted;

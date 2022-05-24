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
      <Pressable 
        onPress={() => navigation.navigate('CreateWallet')}>
        <Text>Create Wallet</Text>
      </Pressable>
      <Pressable onPress={() => navigation.navigate('ImportWallet')}>
        <Text>Import Wallet</Text>
      </Pressable>
    </View>
  );
};

export default GettingStarted;

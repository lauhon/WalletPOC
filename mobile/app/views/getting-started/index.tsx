import {NativeStackScreenProps} from '@react-navigation/native-stack';
import React from 'react';
import {
  Button,
  StyleProp,
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
      <Button
        onPress={() => navigation.navigate('CreateWallet')}
        title="Create Wallet"
      />
    </View>
  );
};

export default GettingStarted;

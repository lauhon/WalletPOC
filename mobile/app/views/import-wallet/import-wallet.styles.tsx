import { StyleSheet } from 'react-native';

export const getStyles = (isDark: boolean) => StyleSheet.create({
    container: {
        flex:1,
        alignItems: 'center',
        margin:16,
    },

    text: {
        color: isDark ? 'FFF' : "000",
        fontWeight: '700',
        textAlign: 'center',
    },

    button:{
        backgroundColor:'blue',
        padding:16,
        color: 'white',
        margin:8,
        borderRadius: 6,
    },
    buttonText: {
        color: 'white',
    },
    input: {
        height: 40,
        margin: 12,
        borderWidth: 1,
        padding: 10,
        width: 300,
    },
   
});
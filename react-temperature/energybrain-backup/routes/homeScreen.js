import { StyleSheet, Text, View, Image, Dimensions } from 'react-native';
import React, { useState } from 'react';
import * as Font from 'expo-font';
import { Asset } from 'expo';

export default function HomeScreen() {
    // load fonts
    const [fontsLoaded, setFontsLoaded] = useState(false);
    async function loadFonts() {
        try {
            console.log('Loading fonts...');
            const font = require('../assets/fonts/Montserrat-Regular.ttf');
            await Font.loadAsync({
                'Montserrat': font,
            });
            console.log('Fonts loaded!');
            setFontsLoaded(true);
        } catch (error) {
            console.log('Error loading fonts: ' + error);
        }
    }
    loadFonts();

    // if fonts are not loaded, show loading text
    if (!fontsLoaded) {
        return <Text>Hello...</Text>;
    }

    return (
        <View style={styles.container}>
            <View style={styles.logoContainer}>
                <Image style={styles.logo} source={require('../assets/house.png')} />
            </View>
            <View style={styles.roomContainer}>
                <Text style={styles.title}>Casa mea</Text>
                <Text style={styles.listElement}>Dormitor 1</Text>
                <Text style={styles.listElement}>Baie</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#8FABBC',
        alignItems: 'center',
        justifyContent: 'center',
    },
    logoContainer: {
        alignItems: 'center',
    },
    logo: {
        width: Dimensions.get('window').width * 0.8,
        height: Dimensions.get('window').width * 0.6,
        resizeMode: 'contain',
    },
    roomContainer: {
        alignItems: 'center',
        height: Dimensions.get('window').height - Dimensions.get('window').width * 0.6 - 100,
        backgroundColor: '#b8c4cc',
        borderRadius: 20,
        marginTop: 20,
        overflow: 'hidden',
        shadowColor: 'black',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.2,
        shadowRadius: 10,
        elevation: 5,
    },
    title: {
        fontSize: 40,
        fontWeight: 'bold',
        color: 'black',
        backgroundColor: '#dcdcdc',
        width: Dimensions.get('window').width * 0.8,
        textAlign: 'center',
        // fontFamily: 'Mustica'
        fontSize: 30,
        padding: 3,
    },
    listElement: {
        fontSize: 20,
        color: 'black',
        borderColor: 'black',
        borderWidth: 1,
        textAlign: 'left',
        width: Dimensions.get('window').width * 0.8,
        padding: 3,
        fontFamily: 'Montserrat'
    }
});
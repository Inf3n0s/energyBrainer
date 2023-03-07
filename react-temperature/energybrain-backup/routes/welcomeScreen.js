import { StyleSheet, Text, View, Image, Dimensions } from 'react-native';

export default function WelcomeScreen({navigation}) {
    // move to home screen after 3 seconds
    setTimeout(() => {
        navigation.replace('home');
    }, 3000);

    return (
        <View style={styles.container}>
            <View style={styles.logoContainer}>
                <Image style={styles.logo} source={require('../assets/logo.png')} />
            </View>
            <Text style={styles.title}>EnergyBrainer</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#5FAD56',
        alignItems: 'center',
        justifyContent: 'center',
    },
    logoContainer: {
        alignItems: 'center',
    },
    logo: {
        width: Dimensions.get('window').width * 0.7,
        height: Dimensions.get('window').width * 0.7,
    },
    title: {
        fontSize: 40,
        fontWeight: 'bold',
        color: '#008148',
        // fontFamily: 'Mustica'
    },
});
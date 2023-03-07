import { StyleSheet, Text, View, Image, Dimensions } from 'react-native';
import { useRouter } from "expo-router";

export default function App() {
    const router = useRouter();
    // move to home screen after 1.5 seconds
    setTimeout(() => {
        router.replace('/home');
    }, 1500);

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
        width: Dimensions.get('window').width * 0.9,
        height: Dimensions.get('window').width * 0.9,
    },
    title: {
        fontSize: 40,
        fontWeight: 'bold',
        color: '#008148',
        fontFamily: 'Mustica'
    },
});
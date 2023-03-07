import {
    SplashScreen,
    Stack,
} from "expo-router";
import { Text } from "react-native";

import { useFonts } from 'expo-font';

export default function Layout() {
    // Load the font `Inter_500Medium`
    const [fontsLoaded] = useFonts({
        'Mustica': require('../assets/fonts/Mustica-SemiBold.ttf'),
    });

    if (!fontsLoaded) {
        // If the fonts aren't loaded yet, show the splash screen.
        return <SplashScreen>
            <Text>Loading...</Text>
        </SplashScreen>;
    }

    // Render the children routes now that all the assets are loaded.
    return (
        <Stack>
            <Stack.Screen
                name="index"
                options={{
                    headerShown: false,
                }}
            />
            <Stack.Screen
                name="stats"
                options={{
                    headerShown: false,
                }}
            />
        </Stack>
    );
}
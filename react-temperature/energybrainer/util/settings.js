import AsyncStorage from '@react-native-async-storage/async-storage';

export const preferredTemperature = async (newTemp) => {
    try {
        if (newTemp) {
            const jsonValue = JSON.stringify(newTemp);
            await AsyncStorage.setItem('@preferredTemperature', jsonValue);
        } else {
            const jsonValue = await AsyncStorage.getItem('@preferredTemperature');
            if (jsonValue != null) {
                return JSON.parse(jsonValue);
            } else {
                return 20;
            }
        }
    } catch(e) {
        console.log(e);
    }
}
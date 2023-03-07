import AsyncStorage from '@react-native-async-storage/async-storage';

export const getRooms = async () => {
    try {
        const jsonValue = await AsyncStorage.getItem('@rooms')
        // return array of rooms
        if (jsonValue != null) {
            return JSON.parse(jsonValue);
        } else {
            return [];
        }
    } catch(e) {
        console.log(e);
    }
}

export const addRoom = async (room) => {
    try {
        const rooms = await getRooms();
        
        // check if room already exists
        const roomExists = rooms.find(r => r.name === room.name);
        if (roomExists) {
            return;
        }

        rooms.push(room);
        const jsonValue = JSON.stringify(rooms);
        await AsyncStorage.setItem('@rooms', jsonValue);
    } catch(e) {
        console.log(e);
    }
}

export const removeRoom = async (room) => {
    try {
        const rooms = await getRooms();
        const newRooms = rooms.filter(r => r.name !== room.name);
        const jsonValue = JSON.stringify(newRooms);
        await AsyncStorage.setItem('@rooms', jsonValue);
    } catch(e) {
        console.log(e);
    }
}

export const removeAllRooms = async () => {
    try {
        await AsyncStorage.removeItem('@rooms');
    } catch(e) {
        console.log(e);
    }
}
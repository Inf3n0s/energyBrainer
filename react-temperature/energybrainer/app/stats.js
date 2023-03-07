import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Dimensions } from 'react-native';
import { getRooms } from '../util/rooms';
import { Slider } from '@miblanchard/react-native-slider';
import { SafeAreaView } from 'react-native-safe-area-context';
import { preferredTemperature } from '../util/settings';
import { LineChart } from 'react-native-chart-kit';
import { LinearGradient } from 'expo-linear-gradient';
import { ScrollView } from 'react-native-gesture-handler';
import { getTemperatureChart } from '../util/server';

export default function Stats() {
    const [targetTemperature, setTargetTemperature] = useState(null);
    const [currentRoom, setCurrentRoom] = useState(null);
    const [rooms, setRooms] = useState([]);
    const [temperatureChartData, setTemperatureChartData] = useState([0]);
    const [humidityChartData, setHumidityChartData] = useState([0]);
    const [currentRoomTemp, setCurrentRoomTemp] = useState(0);

    let setTargetTemperatureTimeout = null;
    let tempTargetTemperature = targetTemperature;
    // change target temperature in db when slider is moved
    useEffect(() => {
        // if targetTemperature is not null, then it has been set
        if (targetTemperature !== null) {
            // clear timeout if it exists
            if (setTargetTemperatureTimeout) {
                clearTimeout(setTargetTemperatureTimeout);
            }
            // set timeout to update db
            setTargetTemperatureTimeout = setTimeout(() => {
                preferredTemperature(targetTemperature);
            }, 1000);
        }
    }, [tempTargetTemperature]);

    // get temperature chart data from server
    useEffect(() => {
        if (currentRoom) {
            const getTemperatureChartFromServer = async () => {
                const { temp, data } = await getTemperatureChart(currentRoom.name);
                // set current room temperature
                setCurrentRoomTemp(temp);
                // get temperature data
                const temperatureData = data.map(d => d.temperature);
                // get humidity data
                const humidityData = data.map(d => d.humidity);
                // set temperature chart data
                setTemperatureChartData(temperatureData);
                // set humidity chart data
                setHumidityChartData(humidityData);
            }
            getTemperatureChartFromServer();
        }
    }, [currentRoom]);


    useEffect(() => {
        const getRoomsFromStorage = async () => {
            const rooms = await getRooms();
            setRooms(rooms);
            // set current room to first room
            if (rooms.length > 0) {
                setCurrentRoom(rooms[0]);
            }
        }
        const getTargetTemperature = async () => {
            const temp = await preferredTemperature();
            setTargetTemperature(temp);
        }
        getRoomsFromStorage();
        getTargetTemperature();
    }, []);

    return (
        <SafeAreaView style={styles.container}>
            {/* <Text style={styles.title}>Temperatura si umididatea casei</Text> */}
            {/* list of rooms */}
            <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} style={{ width: '100%', paddingLeft: 20, marginTop: 10, flexGrow: 0 }}>
                {rooms.map((room, index) => {
                    let bgColor = 'rgba(0, 0, 0, 0)';
                    let textColor = 'black';
                    if (currentRoom && room.name === currentRoom.name) {
                        bgColor = '#008148';
                        textColor = 'white';
                    }
                    return (
                        <TouchableOpacity key={index} onPress={() => {
                            setCurrentRoom(room);
                        }}
                        >
                            <Text style={{
                                width: 150,
                                borderRadius: 20,
                                borderWidth: 1,
                                borderColor: '#0D7145',
                                backgroundColor: bgColor,
                                textAlign: 'center',
                                fontSize: 16,
                                fontFamily: 'Mustica',
                                padding: 4,
                                marginRight: 10,
                                color: textColor,
                            }} adjustsFontSizeToFit={true}>{room.name}</Text>
                        </TouchableOpacity>
                    )
                })}
            </ScrollView>
            {/* end of list of rooms */}
            {/* current room stats */}
            <ScrollView contentContainerStyle={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                marginTop: 20,
            }}>
                {/* temperature chart */}
                <Text style={styles.subtitle}>Temperatura</Text>
                <LinearGradient colors={['rgba(13, 113, 69, 0.5)', 'rgba(161, 246, 160, 0.1635)']} style={{
                    width: Dimensions.get('window').width * 0.9,
                    borderRadius: 15,
                }}>
                    <LineChart
                        data={{
                            labels: ['00:00', '03:00', '06:00', '09:00', '12:00', '15:00', '18:00', '21:00'],
                            datasets: [{
                                data: temperatureChartData,
                            }]
                        }}
                        width={Dimensions.get('window').width * 0.9}
                        height={Dimensions.get('window').height * 0.2}
                        yAxisSuffix="°C"
                        chartConfig={{
                            backgroundColor: '#008148',
                            backgroundGradientFromOpacity: 0,
                            backgroundGradientToOpacity: 0,
                            decimalPlaces: 0,
                            color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                            labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                            propsForDots: {
                                r: "0",
                            },
                            propsForVerticalLabels: {
                                fontSize: 10,
                                fontFamily: 'Mustica',
                                opacity: 0.5,
                            },
                            propsForHorizontalLabels: {
                                fontSize: 12,
                                fontFamily: 'Mustica',
                                opacity: 0.7,
                            },
                        }}
                        bezier
                        // withInnerLines={false}
                        withOuterLines={false}
                    />
                </LinearGradient>
                {/* humidity chart */}
                <Text style={{...styles.subtitle, marginTop: 20}}>Umiditate</Text>
                <LinearGradient colors={['rgba(13, 113, 69, 0.5)', 'rgba(161, 246, 160, 0.1635)']} style={{
                    width: Dimensions.get('window').width * 0.9,
                    borderRadius: 15,
                }}>
                    <LineChart
                        data={{
                            labels: ['00:00', '03:00', '06:00', '09:00', '12:00', '15:00', '18:00', '21:00'],
                            datasets: [{
                                data: humidityChartData,
                            }]
                        }}
                        fromZero={true}
                        width={Dimensions.get('window').width * 0.9}
                        height={Dimensions.get('window').height * 0.2}
                        yAxisSuffix="%"
                        chartConfig={{
                            backgroundColor: '#008148',
                            backgroundGradientFromOpacity: 0,
                            backgroundGradientToOpacity: 0,
                            decimalPlaces: 0,
                            color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                            labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                            propsForDots: {
                                r: "0",
                            },
                            propsForVerticalLabels: {
                                fontSize: 10,
                                fontFamily: 'Mustica',
                                opacity: 0.5,
                            },
                            propsForHorizontalLabels: {
                                fontSize: 12,
                                fontFamily: 'Mustica',
                                opacity: 0.7,
                            },
                        }}
                        bezier
                        // withInnerLines={false}
                        withOuterLines={false}
                    />
                </LinearGradient>
                <Text style={{
                    fontSize: 22,
                    fontFamily: 'Mustica',
                    padding: 20,
                    alignSelf: 'flex-start',
                }}>Recomandări</Text>
                <Text style={{
                    fontSize: 16,
                    fontFamily: 'Mustica',
                    padding: 20,
                    paddingTop: 0,
                    alignSelf: 'flex-start',
                }}>
                    Temperatura medie a camerei este de {currentRoomTemp}°C. Temperatura dorită este de {targetTemperature}°C. Pentru a atinge temperatura dorită, puteți să deschideți ușile și ferestrele.
                </Text>
            </ScrollView>
            {/* temperature setting */}
            <View style={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                borderTopLeftRadius: 20,
                borderTopRightRadius: 20,
                backgroundColor: 'white',
                elevation: 10,
                position: 'absolute',
                bottom: 0,
            }}>
                <Text style={{
                    fontSize: 16,
                    fontFamily: 'Mustica',
                    margin: 15,
                    marginLeft: 20,
                    alignSelf: 'flex-start',
                }}>Temperatura dorită: {targetTemperature}°C</Text>
                <View style={{
                    width: '80%',
                    height: 70,
                }}>
                    <Slider
                        minimumValue={10}
                        maximumValue={30}
                        minimumTrackTintColor="#008148"
                        maximumTrackTintColor="#000000"
                        thumbTintColor="#008148"
                        value={targetTemperature}
                        onValueChange={(value) => setTargetTemperature(value)}
                        step={0.5}
                    />
                </View>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#A1F6A0',
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
    },
    // title: {
    //     fontSize: 22,
    //     fontFamily: 'Mustica',
    //     margin: 15,
    //     marginTop: 15,
    // },
    subtitle: {
        fontSize: 16,
        fontFamily: 'Mustica',
        opacity: 0.7,
    },
    input: {
        height: 30,
        width: 100,
        margin: 6,
        textAlign: 'center',
        fontSize: 16,
        fontFamily: 'Mustica',
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#0D7145',
        backgroundColor: 'white',
    },
});
import { StyleSheet, Text, View, Image, Dimensions, TouchableOpacity, Alert, Modal, TextInput } from 'react-native';
import { getRooms, removeRoom, addRoom } from '../util/rooms';
import { useState, useEffect, useCallback } from 'react';
import { ScrollView } from 'react-native-gesture-handler';
import { useRouter } from "expo-router";
import { LinearGradient } from 'expo-linear-gradient';
import { LineChart } from 'react-native-chart-kit';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getStats, getTemperatureChart, setRoom } from '../util/server';

function askModal(setModal, title, message, confirmFunction, cancelFunction) {
    const styles = StyleSheet.create({
        centeredView: {
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            marginTop: 22
        },
        modalView: {
            margin: 20,
            backgroundColor: "white",
            borderRadius: 20,
            padding: 35,
            alignItems: "center",
            shadowColor: "#000",
            shadowOffset: {
                width: 0,
                height: 2
            },
            shadowOpacity: 0.25,
            shadowRadius: 4,
            elevation: 5
        },
        openButton: {
            backgroundColor: "#0D7145",
            borderRadius: 20,
            padding: 10,
            elevation: 2,
            width: 100,
        },
        textStyle: {
            color: "white",
            fontWeight: "bold",
            textAlign: "center",
            fontFamily: 'Mustica',
        },
        modalTitle: {
            marginBottom: 15,
            textAlign: "center",
            fontSize: 24,
            fontFamily: 'Mustica',
        },
        modalText: {
            marginBottom: 15,
            textAlign: "center",
            fontSize: 16,
            fontFamily: 'Mustica',
        }
    });

    const onConfirm = () => {
        if (confirmFunction) {
            confirmFunction();
        }
        setModal(null);
    }

    const onCancel = () => {
        if (cancelFunction) {
            cancelFunction();
        }
        setModal(null);
    }

    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={true}
            onRequestClose={() => {
                setModal(null);
                Alert.alert("Modal has been closed.");
            }}
            onConfirm={onConfirm}
            onCancel={onCancel}
        >
            <View style={styles.centeredView}>
                <View style={styles.modalView}>
                    <Text style={styles.modalTitle}>{title}</Text>
                    <Text style={styles.modalText}>{message}</Text>
                    <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 20 }}>
                        <TouchableOpacity
                            style={{ ...styles.openButton, backgroundColor: "#0D7145" }}
                            onPress={onConfirm}
                        >
                            <Text style={styles.textStyle}>Da</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={{ ...styles.openButton, backgroundColor: "#0D7145" }}
                            onPress={onCancel}
                        >
                            <Text style={styles.textStyle}>Nu</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );    
}

function addRoomModal(setModal, setRooms) {
    // modal for adding a room with a name, ok and cancel buttons
    const styles = StyleSheet.create({
        centeredView: {
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            marginTop: 22
        },
        modalView: {
            margin: 20,
            backgroundColor: "white",
            borderRadius: 20,
            padding: 35,
            alignItems: "center",
            shadowColor: "#000",
            shadowOffset: {
                width: 0,
                height: 2
            },
            shadowOpacity: 0.25,
            shadowRadius: 4,
            elevation: 5
        },
        openButton: {
            backgroundColor: "#0D7145",
            borderRadius: 20,
            padding: 10,
            elevation: 2,
            width: 100,
        },
        textStyle: {
            color: "white",
            fontWeight: "bold",
            textAlign: "center",
            fontFamily: 'Mustica',
        },
        modalTitle: {
            marginBottom: 15,
            textAlign: "center",
            fontSize: 24,
            fontFamily: 'Mustica',
        },
        modalText: {
            marginBottom: 15,
            textAlign: "center",
            fontSize: 16,
            fontFamily: 'Mustica',
        },
        input: {
            height: 40,
            margin: 12,
            borderWidth: 1,
            padding: 10,
            width: 200,
            borderRadius: 20,
            borderColor: '#0D7145',
            fontFamily: 'Mustica',
        },
    });

    let roomName = '';

    const onConfirm = async () => {
        if (roomName) {
            // check if room name is unique
            const rooms = await getRooms();
            const room = rooms.find(room => room.name === roomName);
            if (room) {
                alert('Numele camerei trebuie sa fie unic!');
            } else {
                await addRoom({ name: roomName });
                setRooms(await getRooms());
            }
            setModal(null);
        }
    }

    const onCancel = () => {
        setModal(null);
    }

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={true}
            onRequestClose={() => {
                setModal(null);
                Alert.alert("Modal has been closed.");
            }}
            onConfirm={onConfirm}
            onCancel={onCancel}
        >
            <View style={styles.centeredView}>
                <View style={styles.modalView}>
                    <Text style={styles.modalTitle}>Adauga camera</Text>
                    <TextInput
                        style={styles.input}
                        onChangeText={text => roomName = text}
                        placeholder="Nume camera"
                    />
                    <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 20 }}>
                        <TouchableOpacity
                            style={{ ...styles.openButton, backgroundColor: "#0D7145" }}
                            onPress={onConfirm}
                        >
                            <Text style={styles.textStyle}>Da</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={{ ...styles.openButton, backgroundColor: "#0D7145" }}
                            onPress={onCancel}
                        >
                            <Text style={styles.textStyle}>Nu</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
}

export default function App() {
    const router = useRouter();

    // get rooms from local storage
    const [rooms, setRooms] = useState([]);
    const [currentRoom, setCurrentRoom] = useState(null);
    const [modal, setModal] = useState(null);

    useEffect(() => {
        const getRoomsFromStorage = async () => {
            const rooms = await getRooms();
            setRooms(rooms);
        }
        getRoomsFromStorage();
    }, []);

    // get current temperature and humidity every 30 seconds
    const [currentTemperature, setCurrentTemperature] = useState(0);
    const [currentHumidity, setCurrentHumidity] = useState(0);
    const [monitoringStatus, setMonitoringStatus] = useState('-');
    const [temperatureChart, setTemperatureChart] = useState([0]);
    const [hours, setHours] = useState(['0']);
    const [averageTemperature, setAverageTemperature] = useState(0);
    useEffect(() => {
        const interval = setInterval(async () => {
            const { temp, humidity, roomTime } = await getStats();
            setCurrentTemperature(temp);
            setCurrentHumidity(humidity);
            // get elapsed time since last monitoring
            const elapsed = new Date().getTime() - new Date(roomTime).getTime();
            // get the difference between the current time and the last monitoring time in hours and minutes
            const hours = Math.floor(elapsed / 1000 / 60 / 60);
            const minutes = Math.floor(elapsed / 1000 / 60) - hours * 60;
            // set the monitoring status
            if (hours === 0 && minutes === 0) {
                setMonitoringStatus('-');
            }
            setMonitoringStatus(`${hours}h ${minutes}m`);
        }, 30000);
        return () => clearInterval(interval);
    }, []);
    // run once on component mount
    useEffect(() => {
        const getStatsFromServer = async () => {
            const { temp, humidity, room, roomTime } = await getStats();
            setCurrentTemperature(temp);
            setCurrentHumidity(humidity);
            // get elapsed time since last monitoring
            const elapsed = new Date().getTime() - new Date(roomTime).getTime();
            // get the difference between the current time and the last monitoring time in hours and minutes
            const hours = Math.floor(elapsed / 1000 / 60 / 60);
            const minutes = Math.floor(elapsed / 1000 / 60) - hours * 60;
            // set the monitoring status
            if (hours === 0 && minutes === 0) {
                setMonitoringStatus('-');
            }
            setMonitoringStatus(`${hours}h ${minutes}m`);
            // set the current room
            if (room) {
                const rooms = await getRooms();
                const currentRoom = rooms.find(room => room.name === room);
                setCurrentRoom(currentRoom);
            }
        }
        getStatsFromServer();
        const getTemperatureChartFromServer = async () => {
            const { temp, data } = await getTemperatureChart();
            // extract the temperature values
            const tempValues = data.map(item => item.temp);
            // extract only the hours from the date to display on the chart
            let hourLabels = data.map(item => new Date(item.date).toLocaleTimeString().slice(0, 5));
            setTemperatureChart(tempValues);
            setHours(hourLabels);
            setAverageTemperature(temp);
        }
        getTemperatureChartFromServer();
    }, []);

    return (
        <View style={styles.container}>
            {modal}
            <SafeAreaView style={styles.statsContainer}>
                {/* Section 1 */}
                <View style={{ width: '100%', height: '35%', display: 'flex', flexDirection:'row', alignItems: 'center', justifyContent: 'center', gap: 20 }}>
                    <View style={styles.statsContainerSection}>
                        <Image source={require('../assets/temperatureContainer.png')} style={styles.statsContainerImg} />
                        <Text style={styles.statsValue}>{currentTemperature} °C</Text>
                        <Text style={styles.statsTitle}>temperatura</Text>
                    </View>
                    <View style={styles.statsContainerSection}>
                        <Image source={require('../assets/temperatureContainer.png')} style={styles.statsContainerImg} />
                        <Text style={styles.statsValue}>{currentHumidity}%</Text>
                        <Text style={styles.statsTitle}>umiditate</Text>
                    </View>
                </View>
                {/* Section 2 */}
                <View style={{width: '95%'}}>
                    <View style={{ width: '100%', height: '10%', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 20, marginBottom: 8 }}>
                        <Text style={{ marginLeft: 20, fontSize: 24, fontFamily: 'Mustica' }}
                        >Statistici</Text>
                        <TouchableOpacity onPress={() => router.push('/stats')}>
                            <Text
                                style={{ marginRight: 20, fontSize: 16, fontFamily: 'Mustica', color: '#0D7145' }}
                            >Vezi toate &gt;</Text>
                        </TouchableOpacity>
                    </View>
                    {/* chart */}
                    <LinearGradient colors={['rgba(0, 0, 0, 0.2469)', 'rgba(0, 0, 0, 0)']} style={{
                        width: Dimensions.get('window').width * 0.95,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: 12,
                    }}>
                        <Text style={{
                            fontSize: 36,
                            fontFamily: 'Mustica',
                            alignSelf: 'flex-start',
                            marginLeft: 30,
                        }}>{averageTemperature} °C</Text>
                        <Text style={{
                            fontSize: 15,
                            fontFamily: 'Mustica',
                            alignSelf: 'flex-start',
                            marginLeft: 30,
                            opacity: 0.6,
                            marginBottom: 15,
                            marginTop: -5,
                        }}>Temperatura medie</Text>
                        {/* Chart */}
                        <LinearGradient colors={['rgba(13, 113, 69, 0.5)', 'rgba(161, 246, 160, 0.1635)']} style={{
                            width: Dimensions.get('window').width * 0.9,
                            borderRadius: 15,
                        }}>
                            <LineChart
                                data={{
                                    labels: hours,
                                    datasets: [{
                                        data: temperatureChart,
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
                                withInnerLines={false}
                                withOuterLines={false}
                            />
                        </LinearGradient>
                    </LinearGradient>
                </View>
                {/* Section 3 */}
                <View style={{
                    width: '95%',
                    paddingBottom: 20,
                }}>
                    <View style={{
                        width: Dimensions.get('window').width * 0.95, display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 20
                    }}>
                        <Text style={{ marginLeft: 20, fontSize: 24, fontFamily: 'Mustica' }}
                        >Camere</Text>
                        <TouchableOpacity onPress={() => setModal(addRoomModal(setModal, setRooms))}>
                            <Text
                                style={{ marginRight: 20, fontSize: 16, fontFamily: 'Mustica', color: '#0D7145' }}
                            >Adauga camera</Text>
                        </TouchableOpacity>
                    </View>
                    {/* horizontal scroll list */}
                    <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} style={{ width: '100%', paddingLeft: 20, marginTop: 10 }}>
                        {rooms.map((room, index) => {
                            let bgColor = 'rgba(0, 0, 0, 0)';
                            let textColor = 'black';
                            if (currentRoom && room.name === currentRoom.name) {
                                bgColor = '#008148';
                                textColor = 'white';
                            }
                            return (
                                <TouchableOpacity key={index} onPress={() => {
                                    setModal(askModal(setModal, "Setează camera curentă", "Doriți să monitorizați " + room.name + "?", () => {
                                        setRoom(room.name);
                                        setCurrentRoom(room);
                                        // refresh time monitor
                                        setMonitoringStatus('0h 0m');
                                    }));
                                }}
                                    delayLongPress={500}
                                    onLongPress={() => {
                                        setModal(askModal(setModal, "Șterge camera", "Doriți să ștergeți " + room.name + "?", () => {
                                            removeRoom(room);
                                            // refresh state
                                            setRooms(rooms.filter((r) => r.name !== room.name));
                                        }));
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
                </View>
            </SafeAreaView>
            <View style={{
                flex: 1,
                backgroundColor: '#008148',
                alignItems: 'center',
                flexDirection: 'column',
                justifyContent: 'center',
            }}>
                <Text style={{
                    fontSize: 24,
                    fontFamily: 'Mustica',
                    textAlign: 'center',
                }}>Activ timp de</Text>
                <Text style={{
                    fontSize: 36,
                    fontFamily: 'Mustica',
                    marginTop: -5,
                    paddingBottom: 10,
                    color: '#E1BB29'
                }}>{ monitoringStatus }</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#008148',
        alignItems: 'center',
        flexDirection: 'column',
    },
    statsContainer: {
        width: '100%',
        height: '80%',
        backgroundColor: '#A1F6A0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingBottom: 5,
        borderBottomLeftRadius: 32,
        borderBottomRightRadius: 32,
    },
    statsContainerSection: {
        width: '40%',
        height: Dimensions.get('window').height * 0.4,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    statsContainerImg: {
        resizeMode: 'contain',
        position: 'absolute',
        left: 0,
        right: 0,
        width: '100%',
        height: '100%',
    },
    statsValue: {
        fontSize: 40,
        fontFamily: 'Mustica',
        color: '#0D7145',
    },
    statsTitle: {
        fontSize: 15,
        fontFamily: 'Mustica',
        color: '#0D7145',
    },
});
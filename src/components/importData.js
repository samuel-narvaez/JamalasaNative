import React, { useEffect, useState } from "react";
import { useSelector } from 'react-redux';
import { View, Text, Pressable } from "react-native";
import Icon from 'react-native-vector-icons/FontAwesome';
import NetInfo from "@react-native-community/netinfo";
import styles from "../assets/styleMenu";
import moment from 'moment';
import {
    getDBConnection,
    getCowSync,
    getEventSync,
    getCowsCalf,
    getEquipmentSync,
    insertEquipment,
    deleteAllCows,
    deleteAllEvents,
    deleteAllPivot,
    deleteAllEquipment,
    insertEvents,
    insertCows,
    insertPivotCowsCalf
} from '../utils/database';

import { Requests } from '../utils/databaseServer';
const petitions = new Requests();


export default function App(props) {
    const [data, setData] = useState([]);
    const [dataEvents, setDataEvents] = useState([]);
    const [dataPivot, setDataPivot] = useState([]);
    const [dataEquipment, setDataEquipment] = useState([]);
    const [date, setDate] = useState("");

    //DISABLES
    const [isConnected, setIsConnected] = useState(false);
    const [isSync, setIsSync] = useState(true);

    const statusEvents = useSelector((state) => { return state.products.eventsStatus });
    const statuscows = useSelector((state) => { return state.products.cowStatus });

    const upDataCows = async () => {
        try {
            const db = await getDBConnection();
            let response = await petitions.Cows();
            if (response.data.length > 0) {
                await deleteAllCows(db);
                response.data.forEach(async (element) => {
                    await insertCows(db, element);
                });
                return status = 200;
            } else {
                alert('No hay animales para actualizar!');
            }
        } catch (error) {
            console.log(error.message);
        }
    }

    const upDataPivot = async () => {
        try {
            const db = await getDBConnection();
            let response = await petitions.Pivot();
            if (response.data.length > 0) {
                await deleteAllPivot(db)
                response.data.forEach(async (element) => {
                    await insertPivotCowsCalf(db, element);
                });
                return status = 200;
            } else {
                alert('No hay Relaciones Pivot para actualizar!');
            }
        } catch (error) {
            console.log(error.message);
        }
    }

    const upEventsCows = async () => {
        try {
            const db = await getDBConnection();
            let response = await petitions.Events();
            if (response.data.length > 0) {
                await deleteAllEvents(db);
                response.data.forEach(async (element) => {
                    let datos = [{
                        cause: element.cause, 
                        species: element.codeCows, 
                        date: element.date, 
                        money: element.money, 
                        synchronization: element.synchronization
                    }]
                    await insertEvents(db, datos);
                });
                return status = 200;
            } else {
                alert('No hay eventos para actualizar!');
            }
        } catch (error) {
            console.log(error.message);
        }
    }

    const upEquipment = async () => {
        try {
            const db = await getDBConnection();
            let response = await petitions.Equipment();
            if (response.data.length > 0) {
                await deleteAllEquipment(db);
                response.data.forEach(async (element) => {
                    await insertEquipment(db, element);
                });
                return status = 200;
            } else {
                alert('No hay equipamientos para actualizar!');
            }
        } catch (error) {
            console.log(error.message);
        }
    }

    const insertDate = async () => {
        try {
            const now = new Date();
            let date = moment(now).format('YYYY-MM-DD HH:mm:ss');
            await petitions.insertDateUp(date);
        } catch (error) {
            console.log(error.message);
        }
    }

    const loadDataCows = async () => {
        try {
            const db = await getDBConnection();
            const cowsFromDatabase = await getCowSync(db);
            setData(cowsFromDatabase);
            await db.close();
        } catch (error) {
            console.log(error.message);
        }
    }

    const lodaDataEvents = async () => {
        try {
            const db = await getDBConnection();
            const cowsFromDatabase = await getEventSync(db);
            setDataEvents(cowsFromDatabase);
            await db.close();
        } catch (error) {
            console.log(error.message);
        }
    }

    const lodaDataCowsCalf = async () => {
        try {
            const db = await getDBConnection();
            const pivotFromDatabase = await getCowsCalf(db);
            setDataPivot(pivotFromDatabase);
            await db.close();
        } catch (error) {
            console.log(error.message);
        }
    }

    const lodaDataEquipment = async () => {
        try {
            const db = await getDBConnection();
            const FromDatabase = await getEquipmentSync(db);
            setDataEquipment(FromDatabase);
            await db.close();
        } catch (error) {
            console.log(error.message);
        }
    }

    const validateSync = async () => {
        if (data.length > 0 || dataEvents.length > 0 || dataPivot.length > 0 || dataEquipment.length > 0 || statusEvents.length > 0 || statuscows.length > 0) {
            setIsSync(true);
        } else {
            setIsSync(false);
        }
    }

    const lodaDataDate = async () => {
        try {
            let response = await petitions.DataUp();
            const {_datetme} = response.data[0]
            let date = moment(_datetme).format('YYYY-MM-DD HH:mm:ss');
            setDate(date)
        } catch (error) {
            console.log(error.message);
        }
    }

    useEffect(() => {
        loadDataCows();
        lodaDataEvents();
        lodaDataCowsCalf()
        lodaDataEquipment();
    }, [])

    useEffect(() => { validateSync() })

    useEffect(() => {
        const unsubscribe = NetInfo.addEventListener(state => {
            setIsConnected(state.isConnected);
            lodaDataDate();
        });

        return () => {
            unsubscribe();
        }
    }, []);

    const updateData = async () => {
        let upAnimals = await upDataCows();
        let upEvents = await upEventsCows();
        let upEquipments = await upEquipment();
        let upPivot = await upDataPivot();
        if (upAnimals == 200 && upEvents == 200 || upEquipments == 200 || upPivot == 200) {
            await insertDate();
            alert("Data Actualizada Correctamente");
        }
    }

    return (
        <>
            <View style={styles.view}>
                <View style = {{ flexDirection: 'row', alignItems: 'center', left: 150 }}>
                    <Pressable style={[styles.buttonBack, {right: 150}]} onPress={() => props.navigation.navigate('Menu')}>
                        <Icon name="reply-all" size={30} color="black" />
                    </Pressable>
                    <Text style={styles.titleChart}>Estados De Sincronizacion</Text>
                </View>
                <View>
                    <View style={{
                        position: 'absolute',
                        height: 50,
                        top: 40,
                        width: '100%',
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor: isSync ? '#CD5C5C' : '#87CEFA'
                    }}>
                        <Text style={{ color: 'black' }}>{isSync ? 'Tiene Datos Pendientes Por Sincronizar' : 'No tiene Datos Pendientes por Sincronizar , Puede Actualizar'}</Text>
                    </View>
                </View>
                <View style={[!isSync && { display: 'none' }, { justifyContent: 'center', alignItems: 'center' }]}>
                    <Pressable style={[styles.buttonImport, styles.buttonClose]} onPress={() => props.navigation.navigate('Sincronizacion')}>
                        <Text style={styles.textStyle}>Ir a Sincronizar Datos Faltantes</Text>
                    </Pressable>
                </View>
                <View style={[isSync && { display: 'none' }, { justifyContent: 'center', alignItems: 'center' }]}>
                    <Pressable style={[styles.buttonImport, styles.buttonClose]} onPress={() => updateData()}>
                        <Text style={styles.textStyle}>Actualizar Datos</Text>
                    </Pressable>
                </View>
                <View>
                    <View style={{
                        position: 'absolute',
                        bottom: 0,
                        height: 50,
                        top: 698,
                        width: '100%',
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor: 'black'
                    }}>
                        <Text style={{ color: '#fff' }}>Ultima Actualizacion Hecha : {date}</Text>
                    </View>
                </View>
                <View style={{ flex: 1 }}>
                    <View style={{
                        position: 'absolute',
                        bottom: 0,
                        height: 50,
                        width: '100%',
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor: isConnected ? 'green' : 'black'
                    }}>
                        <Text style={{ color: '#fff' }}>{isConnected ? 'Online' : 'Not Network Connection'}</Text>
                    </View>
                </View>
            </View>
        </>
    )
}


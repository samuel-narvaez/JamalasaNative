import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { View, ScrollView, Text, Pressable, Alert, TextInput } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import Icon from 'react-native-vector-icons/FontAwesome';
import { getDBConnection, getEventCows, insertEvents, updateStatusCows } from '../utils/database';
import moment from 'moment'
import styles from "../assets/style";
import Header from "./Header";



export default function App(props) {
    const [data, setData] = useState([]);
    const [cause, setCause] = useState("");
    const [species, setSpecies] = useState("");
    const [dataSpecies, setDataSpecies] = useState([]);
    const [dataRegx, setDataRegx] = useState([]);
    const [priceSale, setPriceSale] = useState(0);
    const [showValue, SetShowValue] = useState(false);

    const dispatch = useDispatch();
    

    const loadData = async () => {
        try {
            const db = await getDBConnection();
            const cowsFromDatabase = await getEventCows(db);
            console.log(cowsFromDatabase);
            setData(cowsFromDatabase);
            await db.close();
        } catch (error) {
            console.log(error.message);
        }
    }

    useEffect(() => { loadData(); }, [])

    const Save = async () => {
        try {
            if (dataSpecies.length != 0) {
                const db = await getDBConnection();
                await insertEvents(db, dataSpecies);
                await updateStatusCows(db, dataRegx);
                dispatch({ type: "EVENTSTATUS_CHANGE", payload: dataRegx })
                Alert.alert(
                    'success',
                    'EVENTO CREADO CORRECTAMENTE',
                    [{
                        text: 'Ok',
                        onPress: () => props.navigation.navigate('Menu')

                    }]
                )
                db.close();
            } else {
                Alert.alert(
                    'Error',
                    'NO HAY NINGUN EVENTO',
                    [{
                        text: 'Cerrar'
                    }]
                )
            }
        } catch (error) {
            console.log(error.message);
        }
    }

    const addButton = () => {
        let separateSpecies = species.split('*');
        let specifictSpecies = separateSpecies[0];
        let valueSpecies = separateSpecies[1];
        if (cause != "" && species != "") {
            const now = new Date();
            let date = moment(now).format('YYYY-MM-DD');
            let prod = dataSpecies.filter((o) => { return o.species === specifictSpecies });
            let winOrLose = priceSale - valueSpecies;
            let total = winOrLose < 0 ? 'Venta - Perdio un total de : ' + winOrLose : 'Venta - Gano un total de : ' + winOrLose;
            let causes = cause == 'Venta' ? total : cause;
            if (!prod.length) {
                if (cause == 'Venta') {
                    setDataSpecies(current => [...current, { cause: causes, species: specifictSpecies, money: 1, date, synchronization:0 }]);
                } else {
                    setDataSpecies(current => [...current, { cause: causes, species: specifictSpecies, money: 0, date, synchronization:0 }]);
                }
                setDataRegx(current => [...current, { status: 0, code: specifictSpecies }]);
                setCause("");
                setSpecies("");
                setPriceSale("");
                SetShowValue(false);
            } else {
                Alert.alert(
                    'Error',
                    'Ya este Ganado fue Agregado a la lista' + ' - ' + specifictSpecies,
                    [{
                        text: 'Cerrar'
                    }]
                )
                setSpecies("");
            }
        }
    }

    const trashButton = (index) => {
        setDataSpecies((prevState) => {
            dataSpecies.splice(index, 1);
            return [...prevState]
        })
    }

    const itemPickerOfSpices = () => {
        return data.map(species => <Picker.Item label={species.code} value={species.code + "*" + species.priceAnimal} />);
    }

    const selectCause = (selected) => {
        setCause(selected)
        if (selected == "Venta") {
            SetShowValue(true)
        } else {
            SetShowValue(false);
        }
    }

    return (
        <>
            <Header />
            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.content}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                        <View style={{ width: 190, padding: 5 }}>
                            <Text style={[styles.text, { textAlign: 'center' }]}>Causa</Text>
                            <Picker
                                style={styles.pickerStyle}
                                itemStyle={styles.dropdownBtnStyle}
                                mode="dropdown"
                                selectedValue={cause}
                                dropdownIconColor={'white'}
                                onValueChange={selected => selectCause(selected)}>
                                <Picker.Item label="Causa..." value="" />
                                <Picker.Item label="Muerta" value="Muerta" />
                                <Picker.Item label="Venta" value="Venta" />
                            </Picker>
                        </View>

                        <View style={{ width: 190, padding: 5 }}>
                            <Text style={[styles.text, { textAlign: 'center' }]}>Animal</Text>
                            <Picker
                                style={styles.pickerStyle}
                                itemStyle={styles.dropdownBtnStyle}
                                mode="dropdown"
                                selectedValue={species}
                                dropdownIconColor={'white'}
                                onValueChange={selected => setSpecies(selected)}>
                                <Picker.Item label="Animal..." value="" />
                                {itemPickerOfSpices()}
                            </Picker>
                        </View>

                        <TextInput style={[!showValue && { display: 'none' }, styles.input, { width: 150, height: 51, top: 15 }]} onChangeText={setPriceSale} value={priceSale} keyboardType="numeric" placeholder=' Valor de Venta' />
                        <View>
                            <Icon.Button
                                style={{ marginLeft: 10, marginTop: 25 }}
                                name="plus"
                                size={20}
                                backgroundColor="transparent"
                                underlayColor="transparent"
                                color="blue"
                                padding="0%"
                                onPress={() => addButton()}>
                            </Icon.Button>
                        </View>
                    </View>




                    {dataSpecies.map((element, index) => {
                        return (
                            <>
                                <View style={styles.showData_vaccinationType}>
                                    <Text style={{ width: 298, padding: 5, height: 30 }}>Causa : {element.cause}</Text>
                                    <Text style={{ width: 190, padding: 5, height: 30 }}>Especie : {element.species}</Text>
                                    <Icon.Button
                                        style={{ marginLeft: 5, marginBottom: 3 }}
                                        name="trash"
                                        size={18}
                                        backgroundColor="transparent"
                                        underlayColor="transparent"
                                        color="red"
                                        padding="0%"
                                        onPress={() => trashButton(index)}>
                                    </Icon.Button>
                                </View>
                            </>
                        );
                    })}

                    <Pressable style={[styles.button, styles.buttonSuccess]} onPress={() => Save()}>
                        <Text style={styles.textStyle}>Guardar</Text>
                    </Pressable>
                    <Pressable style={[styles.button, styles.buttonClose]} onPress={() => props.navigation.navigate('Menu')}>
                        <Text style={styles.textStyle}>Volver</Text>
                    </Pressable>
                </View>
            </ScrollView>
        </>
    );
};
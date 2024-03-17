import React, { useState, useCallback } from 'react';
import { Text, View, FlatList, TouchableOpacity, Image } from 'react-native';
import {
    getCows,
    getGender,
    getAnimal,
    getContability,
    getDBConnection
} from '../utils/database';
import { useFocusEffect } from '@react-navigation/native';
import { BarChart, PieChart } from "react-native-chart-kit";

import styles from "../assets/styleMenu";
import Header from "./Header";
import Float from "./float";

export default function App(props) {
    const [data, setData] = useState([]);
    const [dataSell, setDataSell] = useState([]);
    const [macho, setMacho] = useState(0);
    const [hembra, setHembra] = useState(0);

    //PIE
    const [bovinos, setBovinos] = useState(0);
    const [caballares, setCaballares] = useState(0);
    const [mulares, setMulares] = useState(0);
    const [caprinos, setCaprinos] = useState(0);
    const [asnales, setAsnales] = useState(0);

    const dataGender = {
        labels: ["MACHOS", "HEMBRAS"],
        datasets: [
            {
                data: [macho, hembra]
            }
        ]
    };

    const dataAnimal = [
        {
            name: "Bovinos",
            population: bovinos,
            color: "#6495ED",
            legendFontColor: "black",
            legendFontSize: 15,
            paddingLeft: 10
        },
        {
            name: "Caballerares",
            population: caballares,
            color: "#FF8C00",
            legendFontColor: "black",
            legendFontSize: 15
        },
        {
            name: "Mulares",
            population: mulares,
            color: "#FF4500",
            legendFontColor: "black",
            legendFontSize: 15
        },
        {
            name: "Caprinos",
            population: caprinos,
            color: "#F4A460",
            legendFontColor: "black",
            legendFontSize: 15
        },
        {
            name: "Asnales",
            population: asnales,
            color: "#FA8072",
            legendFontColor: "black",
            legendFontSize: 15
        }
    ];

    const chartConfigBar = {
        backgroundGradientFrom: "#3CB371",
        backgroundGradientTo: "#3CB371",
        color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
        strokeWidth: 2,
        barPercentage: 0.7,
        useShadowColorFromDataset: false,
    };

    const chartConfigPie = {
        color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    };

    const SelectedLivesTock = (item) => {
        props.navigation.navigate('Ganado', { category: item.category });
    }

    function countCows(array) {
        let data = [];
        array.reduce(function (res, value) {
            if (!res[value.category]) {
                res[value.category] = {
                    category: value.category,
                    total: 0,
                };
                data.push(res[value.category]);
            }
            res[value.category].total += 1;
            return res;
        }, {});

        return data;
    }

    const focusEffect = useCallback(function () {
        async function chartGender() {
            try {
                const db = await getDBConnection();
                const genderFromDatabase = await getGender(db);
                const { MACHO, HEMBRA } = genderFromDatabase[0];
                setMacho(MACHO);
                setHembra(HEMBRA);
                await db.close();
            } catch (error) {
                console.log(error.message);
            }
        }

        async function chartBreed() {
            try {
                const db = await getDBConnection();
                const breedFromDatabase = await getAnimal(db);
                const { BOVINOS, CABALLARES, MULARES, CAPRINOS, ASNALES } = breedFromDatabase[0];
                setBovinos(BOVINOS);
                setCaballares(CABALLARES);
                setMulares(MULARES);
                setCaprinos(CAPRINOS);
                setAsnales(ASNALES);
                await db.close();
            } catch (error) {
                console.log(error.message);
            }
        }

        async function fetchDb() {
            try {
                const db = await getDBConnection();
                const cowsFromDatabase = await getCows(db);
                const count = countCows(cowsFromDatabase);
                setData(count);
                await db.close();
            } catch (error) {
                console.log(error.message);
            }
        }

        async function getEventsMoney() {
            try {
                setDataSell([])
                const db = await getDBConnection();
                const data = await getContability(db);
                if (data != "") {
                    let result = []
                    data.forEach(element => {
                        let WinOrLose = element.cause.split(":");
                        let numberOfWinOrLose = parseInt(WinOrLose[1]);
                        let buy = element.priceAnimal
                        let sell = numberOfWinOrLose + buy;
                        result.push({
                            code: element.code,
                            numberBuy: buy,
                            numberSell: sell,
                            numberWinOrLose: numberOfWinOrLose
                        });
                    });
                    return setDataSell(result)
                }
            } catch (error) {
                console.log(error.message);
            }
        }

        fetchDb();
        chartGender();
        chartBreed();
        getEventsMoney();
    }, []);

    useFocusEffect(focusEffect);

    const renderItem = ({ item }) => {
        return (
            <>
                <TouchableOpacity onPress={() => SelectedLivesTock(item)}>
                    <View style={styles.card}>
                        <View style={[styles.title, { flexDirection: 'row' }]}>
                            <Text style={styles.textTitle}>Categoria : {item.category} </Text>
                            <Image style={styles.logo} source={require('../assets/vaca.png')} />
                        </View>
                        <View style={styles.icons}>
                            <Text numberOfLines={2} style={styles.detailCard}>
                                Cantidad: {item.total}
                            </Text>
                        </View>
                    </View>
                </TouchableOpacity>
            </>
        );
    };

    const renderSell = ({ item }) => {
        return (
            <>
                <View style={{ flexDirection: 'row', width: '100%' }}>
                    <View style={styles.bodies}>
                        <Text style={styles.textSell}>{item.code}</Text>
                    </View>
                    <View style={styles.bodies}>
                        <Text style={styles.textSell}>{item.numberBuy.toLocaleString('es-ES')}</Text>
                    </View>
                    <View style={styles.bodies}>
                        <Text style={styles.textSell}>{item.numberSell.toLocaleString('es-ES')}</Text>
                    </View>
                    <View style={styles.bodies}>
                        <Text style={styles.textSell}>{item.numberWinOrLose.toLocaleString('es-ES')}</Text>
                    </View>
                </View>
            </>
        );
    };

    return (
        <>
            <Header directions={props} />
            <View style={styles.view}>
                <View style={{ flexDirection: 'row' }}>
                    <View>
                        <Text style={styles.titleChart}>Razas</Text>
                        <PieChart
                            data={dataAnimal}
                            width={360}
                            height={250}
                            chartConfig={chartConfigPie}
                            accessor={"population"}
                            backgroundColor={"transparent"}
                            paddingLeft={"1"}
                            strokeWidth={10}
                            center={[10, 1]}
                            absolute
                            style={{
                                borderRadius: 5,
                                marginVertical: 10,
                                marginHorizontal: 10,
                                backgroundColor: '#3CB371'
                            }}
                        />
                    </View>
                    <View>
                        <Text style={styles.titleChart}>Sexo</Text>
                        <BarChart
                            data={dataGender}
                            width={188}
                            height={250}
                            yAxisLabel=""
                            chartConfig={chartConfigBar}
                            verticalLabelRotation={0}
                            hideLegend={true}
                            style={{
                                borderRadius: 5,
                                marginVertical: 10,
                                marginHorizontal: 10
                            }}
                        />
                    </View>
                </View>
                <Text style={styles.titleChart}>Historial De Ventas</Text>
                <View style={{ flexDirection: 'row', width: '100%' }}>
                    <View style={styles.headers}>
                        <Text style={styles.textSell}>Animal</Text>
                    </View>
                    <View style={styles.headers}>
                        <Text style={styles.textSell}>Precio Del Animal</Text>
                    </View>
                    <View style={styles.headers}>
                        <Text style={styles.textSell}>Precio De Venta</Text>
                    </View>
                    <View style={styles.headers}>
                        <Text style={styles.textSell}>Ganancia ó Perdida</Text>
                    </View>
                </View>
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <FlatList
                        style={{ backgroundColor: 'white' }}
                        keyExtractor={item => item.id}
                        renderItem={renderSell}
                        data={dataSell}
                    />
                </View>
                <Text style={styles.titleChart}>Categorias</Text>
                <FlatList
                    numColumns={1}
                    style={{ backgroundColor: 'white' }}
                    keyExtractor={item => item.id}
                    renderItem={renderItem}
                    data={data}
                />
                <Float direction={props} />
            </View>
        </>
    )
}


import React, { useState, useCallback } from 'react';
import { Text, View, FlatList, TouchableOpacity, Image, Pressable } from 'react-native';
import { getDBConnection, getCowsDisabled } from '../utils/database';
import { useFocusEffect } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';
import styles from "../assets/styleMenu";
import Header from "./Header";

import { Requests } from '../utils/databaseServer';
const petitions = new Requests();

export default function App(props) {

    const [data, setData] = useState([]);

    const SelectedLivesTock = (item) => {
        props.navigation.navigate('Detalles', item)
    }

    const back = () => {
        props.navigation.navigate('Menu');
    }

    const focusEffect = useCallback(function () {
        async function fetchDb() {
            try {
                const db = await getDBConnection();
                const cowsFromDatabase = await getCowsDisabled(db);
                if (cowsFromDatabase != "") {
                    setData(cowsFromDatabase);
                }/* else{
                    let response = await petitions.cowsDisabled();
                    setData(response.data);
                } */
                await db.close();
            } catch (error) {
                console.log(error.message);
            }
        }
        fetchDb();
    }, []);

    useFocusEffect(focusEffect);

    const renderItem = ({ item }) => {
        return (
            <>
                <TouchableOpacity onPress={() => SelectedLivesTock(item)}>
                    <View style={[styles.cardSelect]}>
                        <View style={[styles.title, { flexDirection: 'row' }]}>
                            <Text style={styles.textTitle}>Codigo : {item.code}</Text>
                            <Image style={styles.logo} source={require('../assets/vaca.png')} />
                            <Pressable style={styles.button} onPress={() => deleteCow(item.id)}>
                                <Icon name="trash" size={20} color="red" />
                            </Pressable>
                        </View>
                        <View style={styles.icons}>
                            <Text numberOfLines={1} style={[styles.detailCard, {left:-40}]}>
                                Potrero : {item.farmyard.substring(8, 25)}
                            </Text>
                        </View>
                    </View>
                </TouchableOpacity>
            </>
        );
    };

    return (
        <>
            <Header />
            <View style={styles.view}>
                <Pressable style={styles.buttonBack} onPress={() => back()}>
                    <Icon name="reply-all" size={30} color="black" />
                </Pressable>
                <FlatList
                    numColumns={2}
                    style={{ backgroundColor: 'white' }}
                    keyExtractor={item => item.id}
                    renderItem={renderItem}
                    data={data}
                />
            </View>
        </>
    )
}


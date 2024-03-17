import React, { useState, useCallback } from 'react';
import { Text, View, FlatList, TouchableOpacity, Image, Pressable } from 'react-native';
import { getCowsByCatergory, getDBConnection, deleteCows } from '../utils/database';
import { useFocusEffect } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';
import styles from "../assets/styleMenu";
import Header from "./Header";

export default function App(props) {

    const [data, setData] = useState([]);

    const SelectedLivesTock = (item) => {
        props.navigation.navigate('Detalles', item)
    }

    const deleteCow = async (id) => {
        try {
            const db = await getDBConnection();
            await deleteCows(db, id);
            await db.close();
            props.navigation.navigate('Menu');
        } catch (error) {
            console.log(error.message);
        }
    }

    const back = () => {
        props.navigation.navigate('Menu');
    }

    const focusEffect = useCallback(function () {
        async function fetchDb() {
            const { category } = props.route.params
            try {
                const db = await getDBConnection();
                const cowsFromDatabase = await getCowsByCatergory(db, category);
                setData(cowsFromDatabase);
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
                            <Pressable style={styles.buttonDeleteLiveStock} onPress={() => deleteCow(item.id)}>
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


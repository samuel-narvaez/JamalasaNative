import React, { useState, useCallback } from 'react';
import { View, Text, Pressable, FlatList, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useFocusEffect } from '@react-navigation/native';
import { getDBConnection, getEquipment, deleteOneEquipment } from '../utils/database';
import styles from "../assets/styleMenu";
import Header from "./Header";


export default function App(props) {
     const [data, setData] = useState([]);

     const buttonBack = () => {
          props.navigation.navigate('Menu');
     }

     const deleteEquipment = async (id) => {
          try {
               const db = await getDBConnection();
               await deleteOneEquipment(db, id);
               await db.close();
               props.navigation.navigate('Menu');
          } catch (error) {
               console.log(error.message);
          }
     }

     const focusEffect = useCallback(function () {
          async function loadData() {
               try {
                    const db = await getDBConnection();
                    const equipamentFromDatabase = await getEquipment(db);
                    setData(equipamentFromDatabase);
                    await db.close();
               } catch (error) {
                    console.log(error.message);
               }
          }
          loadData();
     }, []);

     useFocusEffect(focusEffect);

     const renderItem = ({ item }) => {
          return (
               <>
                    <View style={[styles.cardEquipment]}>
                         <View style={[styles.title, { flexDirection: 'column' }]}>
                              <Text style={styles.textTitle}>Nombre : {item.nameEquipment}</Text>
                              <Text style={[styles.textTitle, { right: 100 }]}>Cantidad : {item.quantity}</Text>
                              <Pressable style={[styles.button, { left: 530 }]} onPress={() => deleteEquipment(item.id)}>
                                   <Icon name="trash" size={20} color="red" />
                              </Pressable>
                         </View>
                         <View style={styles.icons}>
                              <Text numberOfLines={2} style={styles.detailCard}>
                                   Fecha : {item.date}
                              </Text>
                              <Text numberOfLines={2} style={[styles.detailCard, { left: 100 }]}>
                                   Precio : {item.price}
                              </Text>
                         </View>
                    </View>
               </>
          );
     };

     return (
          <>
               <Header />
               <View style={styles.content}>
                    <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollView}>
                         <View style={{ flexDirection: 'row' }}>
                              <Pressable style={styles.buttonBack} onPress={() => buttonBack()}>
                                   <Icon name="reply-all" size={30} color="black" />
                              </Pressable>
                         </View>
                         <View style={{ flex: 1 }}>
                              <FlatList
                                   data={data}
                                   nestedScrollEnabled
                                   renderItem={renderItem}
                              />
                         </View>
                    </ScrollView>
               </View>
          </>
     )
}

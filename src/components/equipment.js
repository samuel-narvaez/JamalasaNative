import React, { useState } from 'react';
import { View, ScrollView, Text, Pressable, Alert, TextInput } from 'react-native';
import { getDBConnection, insertEquipment } from '../utils/database';
import moment from 'moment';
import styles from "../assets/style";
import Header from "./Header";

export default function App(props) {

  const [nameEquipment, setNameEquipment] = useState("");
  const [quantity, setQuantity] = useState(0);
  const [price, setPrice] = useState(0);

  const Save = async () => {
    try {
      if (nameEquipment != "" && quantity != "") {
        const now = new Date();
        let date = moment(now).format('YYYY-MM-DD');
        let value = {
          nameEquipment,
          quantity,
          price,
          date,
          synchronization: ""
        }
        const db = await getDBConnection();
        await insertEquipment(db, value)
        Alert.alert('SUCCESS', 'EQUIPAMIENTO GUARDADO CORRECTAMENTE', [{ text: 'CERRAR' }])
        clear();
        db.close();
      } else {
        Alert.alert(
          'ERROR', 'FALTAN DATOS POR LLENAR', [{ text: 'CERRAR' }]
        )
      }
    } catch (error) {
      console.log(error.message);
    }
  }

  const clear = () => {
    setNameEquipment("")
    setQuantity(0)
    setPrice(0)
  }

  return (
    <>
      <Header />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.content}>

          <Text style={styles.text}>Nombre Equipamiento</Text>
          <TextInput style={styles.input} placeholder=' Sillas de montar' onChangeText={setNameEquipment} value={nameEquipment} keyboardType="default" />

          <Text style={styles.text}>Cuantos Tienes?</Text>
          <TextInput style={styles.input} placeholder='0' onChangeText={setQuantity} value={quantity} keyboardType="numeric" />

          <Text style={styles.text}>Que Valor Tienen?</Text>
          <TextInput style={styles.input} placeholder='0' onChangeText={setPrice} value={price} keyboardType="numeric" />

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
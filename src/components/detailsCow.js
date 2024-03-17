import React, { useState, useCallback, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { View, Text, Pressable, Modal, TextInput, Alert, FlatList, ScrollView } from 'react-native';
import { Card } from 'react-native-elements';
import { Picker } from '@react-native-picker/picker';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useFocusEffect } from '@react-navigation/native';
import {
     getDBConnection,
     updateCows,
     getEvents,
     insertEvents,
     insertCows,
     getCodeCow,
     insertPivotCowsCalf,
     getCowsByCalf,
     updateCowsPregnancy,
     getEventsCalf
} from '../utils/database';
import styles from "../assets/style";
import Header from "./Header";
import moment from 'moment'

import { Requests } from '../utils/databaseServer';
const petitions = new Requests();


export default function App(props) {
     const { id, code, animal, gender, category, source, priceAnimal, breed, pregnancy, farmyard, illness, causeIllness, stateCow } = props.route.params;
     const [dataEvents, setDataEvents] = useState([]);

     const convertIntPregnancy = pregnancy.toString();
     //EDIT
     const [pregnancies, setPregnancy] = useState(convertIntPregnancy);
     const [farmyards, setFarmyard] = useState(farmyard);
     const [illnes, setIllness] = useState(illness);
     const [causeIllnes, setCauseIllness] = useState(causeIllness);
     const [editCategory, setEditCategory] = useState(category);
     const [editVaccines, setEditVaccines] = useState("");
     const [OtherVaccines, setOtherVaccines] = useState("");
     const [eventPregnacy, setEventPregnacy] = useState([]);

     //CALF
     const [datacalf, setDataCalf] = useState([]);
     const [modalCalf, setModalCalf] = useState(false);
     const [calfgender, setCalfGender] = useState("");
     const [calfCategory, setCalfCategory] = useState("MENOR A 3 MESES");
     const [numbersequence, setNumberSequence] = useState(0);

     //DISABLES
     const [modalVisible, setModalVisible] = useState(false);
     const [showCauseIllness, SetShowCauseIllness] = useState(false);
     const [showButtonCalf, setShowButtonCalf] = useState(false);
     const [showButtonEdit, setShowButtonEdit] = useState(false);
     const [showPregnacy, setShowPregnacy] = useState(false);
     const [showVaccinesOther, setShowVaccinesOther] = useState(false);
     const [showPregnacyCows, setShowPregnacyCows] = useState(false);

     const dispatch = useDispatch();

     const insertEventsCows = async (text, before, after) => {
          const db = await getDBConnection();
          const now = new Date();
          let date = moment(now).format('YYYY-MM-DD');
          let cause = text + before + ' a ' + after;
          let species = code;
          let eventData = [{ cause, species, date, synchronization: 0 }];
          await insertEvents(db, eventData);
     }

     const updateCow = async () => {
          try {
               let value = { id, pregnancies, farmyards, illnes, causeIllnes, editCategory }
               if (pregnancies != "" && pregnancies != pregnancy) {
                    insertEventsCows(' Cambiando semanas de preñez ', pregnancy, pregnancies);
               }
               if (farmyard != "" && farmyard != farmyards) {
                    insertEventsCows(' Translado del corral ', farmyard, farmyards)
               }
               if (illnes != "" && illness != illnes) {
                    insertEventsCows('Enfermedad: ' + causeIllnes + 'Cambiando de', illness, illnes)
               }
               if (editCategory != "" && category != editCategory) {
                    insertEventsCows('Categoria Cambiada de' + category, editCategory)
               }
               if (editVaccines != "") {
                    let vaccines = editVaccines == "Otros" ? OtherVaccines : editVaccines;
                    const db = await getDBConnection();
                    const now = new Date();
                    let date = moment(now).format('YYYY-MM-DD');
                    let cause = 'Vacunado con ' + vaccines;
                    let species = code;
                    let eventData = [{ cause, species, date, synchronization: 0 }];
                    await insertEvents(db, eventData);
               }
               const db = await getDBConnection();
               await updateCows(db, value)
               Alert.alert(
                    'SUCCESS',
                    'VACA ACTUALIZADA CORRECTAMENTE',
                    [{
                         text: 'Ok',
                         onPress: () => props.navigation.navigate('Ganado')
                    }]
               )
               setModalVisible(false);
               clearUpdate();
               db.close();
          } catch (error) {
               console.log(error.message);
          }
     }

     const clearUpdate = () => {
          setPregnancy(0),
               setFarmyard("")
     }

     const sick = (select) => {
          setIllness(select);
          if (select == 'SI') {
               SetShowCauseIllness(true);
          } else {
               SetShowCauseIllness(false);
          }
     }

     const incremetNumber = (number) => {
          let zero = "0";
          let increment_number = number + 1;
          let length_number = 4 - increment_number.toString().length;
          let secuencia = zero.repeat(length_number) + increment_number;
          return secuencia
     }

     const validateCreateCalf = () => {
          Alert.alert(
               'ALERT',
               'ESTA SEGURO DE CREAR UN TERNERO?',
               [{
                    text: 'SI',
                    onPress: () => CodeCowsIncrement()
               }, {
                    text: 'NO'
               }]
          )
     }

     const CodeCowsIncrement = async () => {
          setModalCalf(!modalVisible)
          const db = await getDBConnection();
          const number = await getCodeCow(db, '5-');
          if (number != "") {
               let sequence = incremetNumber(number[0].numbersequence);
               setNumberSequence(sequence)
          } else {
               let sequence = incremetNumber(0);
               setNumberSequence(sequence)
          }
     }

     const insertCalf = async () => {
          try {
               const now = new Date();
               let date = moment(now).format('YYYY-MM-DD');
               let codeCalf = '5-' + numbersequence;
               let value = {
                    code: codeCalf,
                    gender: calfgender,
                    animal,
                    category: calfCategory,
                    source: 'JAMALASA',
                    breed,
                    pregnancy: 0,
                    farmyard,
                    illness: 'NO',
                    causeIllness: '',
                    date,
                    stateCow: 1,
                    prefix: '5-',
                    numbersequence,
                    priceAnimal: 0,
                    synchronization: 0
               }
               let valuePivot = {
                    codeCows: code,
                    codeCalf,
                    date,
                    synchronization: 0
               }
               let valueUpdatePregnacyCow = {
                    id,
                    code,
                    pregnancy: 0,
               }
               let valueUpdatePregnacyStatus = [{ code, pregnancy: 0 }]
               const db = await getDBConnection();
               await insertCows(db, value);
               await insertPivotCowsCalf(db, valuePivot);
               await updateCowsPregnancy(db, valueUpdatePregnacyCow);
               await insertEventsCows('La vaca ', code + ' pario ', codeCalf);
               dispatch({ type: "COWSTATUS_CHANGE", payload: valueUpdatePregnacyStatus })
               setModalCalf(false);
               setShowButtonCalf(false);
               Alert.alert(
                    'SUCCESS',
                    'TERNERO CREADO CORRECTAMENTE',
                    [{
                         text: 'Ok',
                         onPress: () => props.navigation.navigate('Ganado')
                    }]
               )
               db.close();
          } catch (error) {
               console.log(error.message);
          }
     }

     const buttons = () => {
          if (pregnancy > 0 && stateCow == 1 && gender == 'HEMBRA') {
               setShowButtonCalf(true);
          }
          if (gender == 'HEMBRA') {
               setShowPregnacy(true)
          } else {
               setShowPregnacy(false)
          }
          if (stateCow == 0) {
               setShowButtonCalf(false);
               setShowButtonEdit(false);
          } else {
               setShowButtonEdit(true);
          }
     }

     const buttonBack = () => {
          if (stateCow == 1) {
               props.navigation.navigate('Ganado');
          } else {
               props.navigation.navigate('Historial');
          }
     }

     const itemPickerByFarmyard = () => {
          const Farmyard = [
               { value: "", text: "Seleccionar Corral..." },
               { value: "Potrero el río", text: "Potrero el río" },
               { value: "Potrero el embarcadero", text: "Potrero el embarcadero" },
               { value: "Potrero el faldón", text: "Potrero el faldón" },
               { value: "Potrero el caimito", text: "Potrero el caimito" },
               { value: "Potrero los limones", text: "Potrero los limones" },
               { value: "Potrero el charco las mulas", text: "Potrero el charco las mulas" },
               { value: "Potrero el frente", text: "Potrero el frente" },
               { value: "Potrero el medio", text: "Potrero el medio" },
               { value: "Potrero la cascada", text: "Potrero la cascada" },
               { value: "Potrero el rincón", text: "Potrero el rincón" },
               { value: "Potrero el mango", text: "Potrero el mango" },
               { value: "Potrero el cedro ", text: "Potrero el cedro " },
               { value: "Potrero casa vieja", text: "Potrero casa vieja" },
               { value: "Potrero palo grande", text: "Potrero palo grande" },
               { value: "Potrero la marina", text: "Potrero la marina" },
               { value: "Potrero la mina", text: "Potrero la mina" },
               { value: "Potrero el pomo", text: "Potrero el pomo" },
               { value: "Paritorio 1 ", text: "Paritorio 1 " },
               { value: "Paritorio 2 ", text: "Paritorio 2 " },
               { value: "Potrero el mandarina", text: "Potrero el mandarina" },
               { value: "Potrero el Guamo", text: "Potrero el Guamo" },
               { value: "Potrero el  ollo ", text: "Potrero el  ollo " },
               { value: "Potrero los cacaos", text: "Potrero los cacaos" },
               { value: "potrero la pradera 1", text: "potrero la pradera 1" },
               { value: "Potrero la pradera 2", text: "Potrero la pradera 2" },
               { value: "Potrero la trilla 1", text: "Potrero la trilla 1" },
               { value: "Potrero la trilla 2", text: "Potrero la trilla 2" },
               { value: "Potrero las martejas", text: "Potrero las martejas" },
               { value: "Potrero la torre", text: "Potrero la torre" },
               { value: "Potrero Rey", text: "Potrero Rey" },
               { value: "Potrero el algarrobo", text: "Potrero el algarrobo" },
               { value: "Potrero la toma", text: "Potrero la toma" },
               { value: "Potrero la loma 1", text: "Potrero la loma 1" },
               { value: "Potrero la loma 2", text: "Potrero la loma 2" },
               { value: "Potrero el cafetal", text: "Potrero el cafetal" },
               { value: "Potrero el naranjo", text: "Potrero el naranjo" },
               { value: "Potrero las piñas", text: "Potrero las piñas" },
               { value: "Potrero la cañada", text: "Potrero la cañada" },
               { value: "Potrero el limón", text: "Potrero el limón" },
               { value: "Potrero la Vega", text: "Potrero la Vega" },
               { value: "Potrero el tanque", text: "Potrero el tanque" },
          ]
          return Farmyard.map(Farmyard => <Picker.Item label={Farmyard.text} value={Farmyard.value} />);
     }

     const selectedVaccines = (selected) => {
          setEditVaccines(selected);
          if (selected == 'Otros') {
               setShowVaccinesOther(true)
          } else {
               setShowVaccinesOther(false)
          }
     }

     const focusEffect = useCallback(function () {
          async function loadEvents() {
               try {
                    const db = await getDBConnection();
                    const eventsFromDatabase = await getEvents(db, code);
                    if (eventsFromDatabase != "") {
                         setDataEvents(eventsFromDatabase);
                    } else {
                         let response = await petitions.eventsDisabled(code);
                         setDataEvents(response.data);
                    }
                    await db.close();
               } catch (error) {
                    console.log(error.message);
               }
          }
          async function loadCalf() {
               try {
                    const db = await getDBConnection();
                    const pivotFromDatabase = await getCowsByCalf(db, code);
                    setDataCalf(pivotFromDatabase);
                    await db.close();
               } catch (error) {
                    console.log(error.message);
               }
          }
          async function loadEventsPregnacy() {
               try {
                    const db = await getDBConnection();
                    const eventsFromDatabase = await getEventsCalf(db, code);
                    if (eventsFromDatabase.length > 0) {
                         setShowPregnacyCows(true);
                         let causeEvent = 'El ternero '+ code + ' fue parido por ' + eventsFromDatabase[0].codeCows;
                         let date =  eventsFromDatabase[0].date
                         setEventPregnacy({
                              cause : causeEvent,
                              date
                         })
                         await db.close();
                    }else {
                         setShowPregnacyCows(false);
                    }
               } catch (error) {
                    console.log(error.message);
               }
          }
          loadEvents();
          loadCalf();
          loadEventsPregnacy();
     }, []);

     useFocusEffect(focusEffect);
     useEffect(() => { buttons() }, []);

     return (
          <>
               <Header />
               <View style={styles.content}>
                    <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollView}>
                         <View style={{ flexDirection: 'row' }}>
                              <Pressable style={styles.buttonBack} onPress={() => buttonBack()}>
                                   <Icon name="reply-all" size={30} color="black" />
                              </Pressable>
                              <Pressable style={[!showButtonEdit && { display: 'none' }, styles.buttonBack]} onPress={() => setModalVisible(!modalVisible)}>
                                   <Icon name="edit" size={30} color="blue" />
                              </Pressable>
                              <Pressable style={[!showButtonCalf && { display: 'none' }, styles.buttonCreate]} onPress={() => validateCreateCalf()}>
                                   <Text>Crear Ternero</Text>
                              </Pressable>
                         </View>
                         <Card containerStyle={[styles.containerCard, { height: 340 }]}>
                              <Text style={[styles.contentInfo, { backgroundColor: '#3CB371', textAlign: 'center', width: 550 }]}>{code}</Text>
                              <View style={{ marginBottom: 5, marginTop: 5, flexDirection: 'row', justifyContent: 'center' }}>
                                   <Text style={[styles.contentInfo, { width: 150 }]}>Animal : {animal} </Text>
                                   <Text style={[styles.contentInfo, { width: 240 }]}>Categoria : {category} </Text>
                              </View>
                              <View style={{ marginBottom: 5, marginTop: 5, flexDirection: 'row', justifyContent: 'center' }}>
                                   <Text style={[styles.contentInfo, { width: 150 }]}>Sexo : {gender} </Text>
                                   <Text style={[styles.contentInfo, { width: 270 }]}>Origen : {source} </Text>
                              </View>
                              <View style={{ marginBottom: 5, marginTop: 10, flexDirection: 'row', justifyContent: 'center' }}>
                                   <Text style={[styles.contentInfo, { width: 135 }]}>Raza : {breed} </Text>
                                   <Text style={[styles.contentInfo, { width: 300 }]}>Corral : {farmyard} </Text>
                              </View>
                              <View style={{ marginBottom: 5, marginTop: 10, flexDirection: 'row', justifyContent: 'center' }}>
                                   <Text style={[styles.contentInfo, { width: 150 }]}>Enferma : {illness} </Text>
                                   <Text style={[styles.contentInfo, { width: 150 }]}>Tiempo Preñez : {pregnancy} </Text>
                                   <Text style={[styles.contentInfo, { width: 150 }]}>Precio : {priceAnimal.toLocaleString('es-ES')} </Text>
                              </View>
                         </Card>
                         <Card containerStyle={[styles.containerCardCause, { height: 150 }]}>
                              <Text style={[styles.contentInfo, { backgroundColor: '#3CB371', textAlign: 'center', width: 500 }]}>Causa De Enfermedad</Text>
                              <Text style={[styles.contentInfo, { width: 150 }]}>{causeIllness == '' ? 'Ninguna' : causeIllness} </Text>
                         </Card>
                         <Card containerStyle={[styles.containerCardCause, { height: 250 }]}>
                              <Text style={[styles.contentInfo, { backgroundColor: '#3CB371', textAlign: 'center', width: 500 }]}>trazabilidad</Text>
                              <View style={{ flex: 1 }}>
                                   <View style={[!showPregnacyCows && { display: 'none' },styles.showData_events]}>
                                        <Text style={{ width: 346, padding: 5, height: 30 }}>Evento : {eventPregnacy.cause}</Text>
                                        <Text style={{ width: 150, padding: 5, height: 30 }}>Fecha : {eventPregnacy.date}</Text>
                                   </View>
                                   <FlatList
                                        data={dataEvents}
                                        nestedScrollEnabled
                                        renderItem={({ item }) =>
                                             <View style={[styles.showData_events]}>
                                                  <Text style={{ width: 346, padding: 5, height: 30 }}>Evento : {item.cause}</Text>
                                                  <Text style={{ width: 150, padding: 5, height: 30 }}>Fecha : {item.date}</Text>
                                             </View>
                                        }
                                        contentContainerStyle={{
                                             flexGrow: 1,
                                        }}
                                   />
                              </View>
                         </Card>
                         <Card containerStyle={[styles.containerCardCause, { height: 250, marginBottom: 5 }]}>
                              <Text style={[styles.contentInfo, { backgroundColor: '#3CB371', textAlign: 'center', width: 500 }]}>Terneros</Text>
                              <View style={{ flex: 1 }}>
                                   <FlatList
                                        data={datacalf}
                                        nestedScrollEnabled
                                        renderItem={({ item }) =>
                                             <View style={[styles.showData_events]}>
                                                  <Text style={{ width: 346, padding: 5, height: 30 }}>Ternero : {item.codeCalf}</Text>
                                                  <Text style={{ width: 150, padding: 5, height: 30 }}>Fecha : {item.date}</Text>
                                             </View>
                                        }
                                        contentContainerStyle={{
                                             flexGrow: 1,
                                        }}
                                   />
                              </View>
                         </Card>
                    </ScrollView>

                    {/* modal Edit */}
                    <View style={styles.centeredView}>
                         <Modal animationType="slide" transparent={true} visible={modalVisible} onRequestClose={() => { setModalVisible(!modalVisible) }}>
                              <View style={styles.modalView}>
                                   <Text style={[!showPregnacy && { display: 'none' }, styles.text, { marginTop: 10 }]}>Tiempo Preñez</Text>
                                   <TextInput 
                                        style={[!showPregnacy && { display: 'none' }, styles.input]} 
                                        onChangeText={setPregnancy} 
                                        value={pregnancies}
                                        keyboardType="numeric" 
                                   />

                                   <Text style={styles.text}>Corral</Text>
                                   <Picker
                                        style={styles.pickerStyle}
                                        itemStyle={styles.dropdownBtnStyle}
                                        mode="dropdown"
                                        selectedValue={farmyards}
                                        dropdownIconColor={'white'}
                                        onValueChange={selected => setFarmyard(selected)}>
                                        {itemPickerByFarmyard()}
                                   </Picker>

                                   <Text style={styles.text}>Categoria</Text>
                                   <Picker
                                        style={styles.pickerStyle}
                                        itemStyle={styles.dropdownBtnStyle}
                                        mode="dropdown"
                                        selectedValue={editCategory}
                                        dropdownIconColor={'white'}
                                        onValueChange={selected => setEditCategory(selected)}>
                                        <Picker.Item label="Seleccionar Categoria..." value="" />
                                        <Picker.Item label="MENOR A 3 MESES" value="MENOR A 3 MESES" />
                                        <Picker.Item label="DE 3 HASTA 9 MESES" value="DE 3 HASTA 9 MESES" />
                                        <Picker.Item label="DE 9 HASTA 12 MESES" value="DE 9 HASTA 12 MESES" />
                                        <Picker.Item label="DE 1 HASTA 2 AÑOS" value="DE 1 HASTA 2 AÑOS" />
                                        <Picker.Item label="DE 2 HASTA 3 AÑOS" value="DE 2 HASTA 3 AÑOS" />
                                        <Picker.Item label="DE 3 HASTA 5 AÑOS" value="DE 3 HASTA 5 AÑOS" />
                                        <Picker.Item label="MAYOR DE 5 AÑOS" value="MAYOR DE 5 AÑOS" />
                                   </Picker>

                                   <Text style={styles.text}>Vacunas</Text>
                                   <Picker
                                        style={styles.pickerStyle}
                                        itemStyle={styles.dropdownBtnStyle}
                                        mode="dropdown"
                                        selectedValue={editVaccines}
                                        dropdownIconColor={'white'}
                                        onValueChange={selected => selectedVaccines(selected)}>
                                        <Picker.Item label="Seleccionar Vacuna..." value="" />
                                        <Picker.Item label="Oxitetraciclina" value="Oxitetraciclina" />
                                        <Picker.Item label="Ivermectina" value="Ivermectina" />
                                        <Picker.Item label="Multivitaminico" value="Multivitaminico" />
                                        <Picker.Item label="Cloruro de Sodio" value="Cloruro de Sodio" />
                                        <Picker.Item label="Antiinflamatorio" value="Antiinflamatorio" />
                                        <Picker.Item label="Otros" value="Otros" />
                                   </Picker>

                                   <Text style={[!showVaccinesOther && { display: 'none' }, styles.text]}>Nombre Vacuna</Text>
                                   <TextInput style={[!showVaccinesOther && { display: 'none' }, styles.input]} onChangeText={setOtherVaccines} value={OtherVaccines} keyboardType="default" />

                                   <Text style={styles.text}>Emfermedad</Text>
                                   <Picker
                                        style={styles.pickerStyle}
                                        itemStyle={styles.dropdownBtnStyle}
                                        mode="dropdown"
                                        selectedValue={illnes}
                                        dropdownIconColor={'white'}
                                        onValueChange={selected => sick(selected)}>
                                        <Picker.Item label="seleccionar Enfermedad..." value="" />
                                        <Picker.Item label="SI" value="SI" />
                                        <Picker.Item label="NO" value="NO" />
                                   </Picker>

                                   <Text style={[!showCauseIllness && { display: 'none' }, styles.text]}>Cual Enfermedad?</Text>
                                   <TextInput style={[!showCauseIllness && { display: 'none' }, styles.input]} onChangeText={setCauseIllness} value={causeIllnes} keyboardType="default" />

                                   <Pressable style={[styles.button, styles.buttonSuccess]} onPress={() => updateCow()}>
                                        <Text style={styles.textStyle}>Actualizar</Text>
                                   </Pressable>
                                   <Pressable style={[styles.button, styles.buttonClose]} onPress={() => setModalVisible(!modalVisible)}>
                                        <Text style={styles.textStyle}>Cerrar</Text>
                                   </Pressable>
                              </View>
                         </Modal>
                    </View>

                    {/* modal insert calf */}
                    <View style={styles.centeredView}>
                         <Modal animationType="slide" transparent={true} visible={modalCalf} onRequestClose={() => { setModalCalf(!modalCalf) }}>
                              <View style={styles.modalView}>
                                   <Text style={[styles.text, { marginTop: 80 }]}>Sexo</Text>
                                   <Picker
                                        style={styles.pickerStyle}
                                        itemStyle={styles.dropdownBtnStyle}
                                        mode="dropdown"
                                        selectedValue={calfgender}
                                        dropdownIconColor={'white'}
                                        onValueChange={selected => setCalfGender(selected)}>
                                        <Picker.Item label="Seleccionar Sexo..." value="" />
                                        <Picker.Item label="HEMBRA" value="HEMBRA" />
                                        <Picker.Item label="MACHO" value="MACHO" />

                                   </Picker>

                                   <Text style={styles.text}>Categoria</Text>
                                   <Picker
                                        style={styles.pickerStyle}
                                        itemStyle={styles.dropdownBtnStyle}
                                        mode="dropdown"
                                        selectedValue={calfCategory}
                                        dropdownIconColor={'white'}
                                        onValueChange={selected => setCalfCategory(selected)}>
                                        <Picker.Item label="Seleccionar Categoria..." value="" />
                                        <Picker.Item label="MENOR A 3 MESES" value="MENOR A 3 MESES" />
                                        <Picker.Item label="DE 3 HASTA 9 MESES" value="DE 3 HASTA 9 MESES" />
                                        <Picker.Item label="DE 9 HASTA 12 MESES" value="DE 9 HASTA 12 MESES" />
                                        <Picker.Item label="DE 1 HASTA 2 AÑOS" value="DE 1 HASTA 2 AÑOS" />
                                        <Picker.Item label="DE 2 HASTA 3 AÑOS" value="DE 2 HASTA 3 AÑOS" />
                                        <Picker.Item label="DE 3 HASTA 5 AÑOS" value="DE 3 HASTA 5 AÑOS" />
                                        <Picker.Item label="MAYOR DE 5 AÑOS" value="MAYOR DE 5 AÑOS" />
                                   </Picker>

                                   <Pressable style={[styles.button, styles.buttonSuccess]} onPress={() => insertCalf()}>
                                        <Text style={styles.textStyle}>Guardar</Text>
                                   </Pressable>
                                   <Pressable style={[styles.button, styles.buttonClose]} onPress={() => setModalCalf(!modalCalf)}>
                                        <Text style={styles.textStyle}>Cerrar</Text>
                                   </Pressable>
                              </View>
                         </Modal>
                    </View>
               </View>
          </>
     )
}

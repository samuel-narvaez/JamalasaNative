import React, { useState } from 'react';
import { View, ScrollView, Text, Pressable, Alert, TextInput } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { getDBConnection, insertCows, getCodeCow, insertEvents } from '../utils/database';
import moment from 'moment';
import styles from "../assets/style";
import Header from "./Header";

export default function App(props) {

  const [code, setCode] = useState("");
  const [gender, setGender] = useState("");
  const [category, setCategory] = useState("");
  const [source, setSource] = useState("");
  const [breed, setBreed] = useState("");
  const [pregnancy, setPregnancy] = useState(0);
  const [farmyard, setFarmyard] = useState("");
  const [illness, setIllness] = useState("");
  const [causeIllness, setCauseIllness] = useState("");
  const [numbersequence, setNumberSequence] = useState(0);
  const [priceAnimal, setPriceAnimal] = useState(0);
  const [prefix, setPrefix] = useState("");
  const [animal, setAnimal] = useState("");

  //CONDITIONALS
  const [showCauseIllness, SetShowCauseIllness] = useState(false);
  const [showBreed, SetShowBreed] = useState(false);


  const sick = (select) => {
    setIllness(select);
    if (select == 'SI') {
      SetShowCauseIllness(true);
    } else {
      SetShowCauseIllness(false);
    }
  }

  const insertEventsCows = async (code) => {
    const db = await getDBConnection();
    const now = new Date();
    let date = moment(now).format('YYYY-MM-DD');
    let cause = 'Registro de ' + code;
    let species = code;
    let eventData = [{ cause, species, date, synchronization: 0 }];
    await insertEvents(db, eventData);
  }

  const Save = async () => {
    try {
      if (category != "" && farmyard != "" && numbersequence != "" && prefix != "") {
        const now = new Date();
        let date = moment(now).format('YYYY-MM-DD');
        let stateCow = 1;
        let code = prefix + numbersequence;
        let breedSelect = breed == "" ? "NINGUNA" : breed;
        let value = {
          code,
          gender,
          category,
          source,
          breed: breedSelect,
          pregnancy,
          farmyard,
          illness,
          causeIllness,
          date,
          stateCow,
          prefix,
          numbersequence,
          animal,
          priceAnimal,
          synchronization: 0
        }
        const db = await getDBConnection();
        await insertCows(db, value)
        await insertEventsCows(code);
        Alert.alert(
          'SUCCESS',
          'ANIMAL CREADO CORRECTAMENTE',
          [{
            text: 'CERRAR',
            onPress: () => props.navigation.navigate('Menu')
          }]
        )
        clear();
        db.close();
      } else {
        Alert.alert(
          'ERROR',
          'DIGILENCIAR TODO LOS DATOS',
          [{
            text: 'CERRAR'
          }]
        )
      }
    } catch (error) {
      console.log(error.message);
    }
  }

  const clear = () => {
    setCode("")
    setGender("")
    setCategory("")
    setSource("")
    setBreed("")
    setPregnancy(0)
    setFarmyard("")
    setIllness("")
    setCauseIllness("")
  }

  const incremetNumber = (number) => {
    let zero = "0";
    let increment_number = number + 1;
    let length_number = 4 - increment_number.toString().length;
    let secuencia = zero.repeat(length_number) + increment_number;
    return secuencia
  }

  const CodeCowsIncrement = async (selected) => {
    const db = await getDBConnection();
    const number = await getCodeCow(db, selected);
    if (number != "") {
      let sequence = incremetNumber(number[0].numbersequence);
      setNumberSequence(sequence)
    } else {
      let sequence = incremetNumber(0);
      setNumberSequence(sequence)
    }
  }

  const codeIncrementBySource = async (selected) => {
    setSource(selected);
    switch (selected) {
      case 'PUERTO BERRIO':
        setPrefix('1-');
        CodeCowsIncrement('1-');
        break;
      case 'SANAGUS':
        setPrefix('2-');
        CodeCowsIncrement('2-');
        break;
      case 'FERIA MEDELLIN':
        setPrefix('3-');
        CodeCowsIncrement('3-');
        break;
      case 'OTROS ORIGENES':
        setPrefix('4-');
        CodeCowsIncrement('4-');
        break;
      case 'JAMALASA':
        setPrefix('5-');
        CodeCowsIncrement('5-');
        break;
      case 'PUERTO BERRIO OTROS':
        setPrefix('6-');
        CodeCowsIncrement('6-');
        break;
      default:
        break;
    }
  }

  const selectAnimal = (selected) => {
    setAnimal(selected)
    selected == "BOVINOS" ? SetShowBreed(true) : SetShowBreed(false);
  }

  const itemPickerByAnimals = () => {
    if (animal == 'BOVINOS' || animal == 'ASNALES') {
      const CowAndDonkey = [
        { value: "", text: "Seleccionar Sexo..." },
        { value: "HEMBRA", text: "HEMBRA" },
        { value: "MACHO", text: "MACHO" }
      ]
      return CowAndDonkey.map(CowAndDonkey => <Picker.Item label={CowAndDonkey.text} value={CowAndDonkey.value} />);
    }
    if (animal == 'CABALLARES') {
      const Horse = [
        { value: "", text: "Seleccionar Sexo..." },
        { value: "CABALLOS", text: "CABALLOS" },
        { value: "YEGUAS", text: "YEGUAS" }
      ]
      return Horse.map(Horse => <Picker.Item label={Horse.text} value={Horse.value} />);
    }
    if (animal == 'MULARES') {
      const Mule = [
        { value: "", text: "Seleccionar Sexo..." },
        { value: "MULAS", text: "MULAS" },
        { value: "MACHOS", text: "MACHOS" }
      ]
      return Mule.map(Mule => <Picker.Item label={Mule.text} value={Mule.value} />);
    }
    if (animal == 'CAPRINOS') {
      const Goat = [
        { value: "", text: "Seleccionar Sexo..." },
        { value: "CABRAS", text: "CABRAS" },
        { value: "CARNEROS", text: "CARNEROS" }
      ]
      return Goat.map(Goat => <Picker.Item label={Goat.text} value={Goat.value} />);
    }
    if (animal == '') {
      const others = [
        { value: "", text: "Seleccionar Sexo..." },
      ]
      return others.map(others => <Picker.Item label={others.text} value={others.value} />);
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

  return (
    <>
      <Header />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.content}>

          <Text style={styles.text}>Tipo de Animal</Text>
          <Picker
            style={styles.pickerStyle}
            itemStyle={styles.dropdownBtnStyle}
            mode="dropdown"
            selectedValue={animal}
            dropdownIconColor={'white'}
            onValueChange={selected => selectAnimal(selected)}>
            <Picker.Item label="Seleccionar animal..." value="" />
            <Picker.Item label="BOVINOS" value="BOVINOS" />
            <Picker.Item label="CABALLARES" value="CABALLARES" />
            <Picker.Item label="MULARES" value="MULARES" />
            <Picker.Item label="CAPRINOS" value="CAPRINOS" />
            <Picker.Item label="ASNALES" value="ASNALES" />
          </Picker>

          <Text style={styles.text}>Sexo</Text>
          <Picker
            style={styles.pickerStyle}
            itemStyle={styles.dropdownBtnStyle}
            mode="dropdown"
            selectedValue={gender}
            dropdownIconColor={'white'}
            onValueChange={selected => setGender(selected)}>
            {itemPickerByAnimals()}
          </Picker>

          <Text style={styles.text}>Categoria</Text>
          <Picker
            style={styles.pickerStyle}
            itemStyle={styles.dropdownBtnStyle}
            mode="dropdown"
            selectedValue={category}
            dropdownIconColor={'white'}
            onValueChange={selected => setCategory(selected)}>
            <Picker.Item label="Seleccionar Categoria..." value="" />
            <Picker.Item label="MENOR A 3 MESES" value="MENOR A 3 MESES" />
            <Picker.Item label="DE 3 HASTA 9 MESES" value="DE 3 HASTA 9 MESES" />
            <Picker.Item label="DE 9 HASTA 12 MESES" value="DE 9 HASTA 12 MESES" />
            <Picker.Item label="DE 1 HASTA 2 AÑOS" value="DE 1 HASTA 2 AÑOS" />
            <Picker.Item label="DE 2 HASTA 3 AÑOS" value="DE 2 HASTA 3 AÑOS" />
            <Picker.Item label="DE 3 HASTA 5 AÑOS" value="DE 3 HASTA 5 AÑOS" />
            <Picker.Item label="MAYOR DE 5 AÑOS" value="MAYOR DE 5 AÑOS" />
          </Picker>

          <Text style={styles.text}>Costo Del Animal</Text>
          <TextInput style={styles.input} onChangeText={setPriceAnimal} value={priceAnimal} keyboardType="numeric" />

          <Text style={styles.text}>Origen</Text>
          <Picker
            style={styles.pickerStyle}
            itemStyle={styles.dropdownBtnStyle}
            mode="dropdown"
            selectedValue={source}
            dropdownIconColor={'white'}
            onValueChange={selected => codeIncrementBySource(selected)}>
            <Picker.Item label="Seleccionar Origen..." value="" />
            <Picker.Item label="PUERTO BERRIO" value="PUERTO BERRIO" />
            <Picker.Item label="SANAGUS" value="SANAGUS" />
            <Picker.Item label="FERIA MEDELLIN" value="FERIA MEDELLIN" />
            <Picker.Item label="OTROS ORIGENES" value="OTROS ORIGENES" />
            <Picker.Item label="JAMALASA" value="JAMALASA" />
            <Picker.Item label="PUERTO BERRIO OTROS" value="PUERTO BERRIO OTROS" />
          </Picker>

          <Text style={[!showBreed && { display: 'none' }, styles.text]}>Raza</Text>
          <Picker
            style={[!showBreed && { display: 'none' }, styles.pickerStyle]}
            itemStyle={styles.dropdownBtnStyle}
            mode="dropdown"
            selectedValue={breed}
            dropdownIconColor={'white'}
            onValueChange={selected => setBreed(selected)}>
            <Picker.Item label="Seleccionar Raza..." value="" />
            <Picker.Item label="BRAHMAN" value="BRAHMAN" />
            <Picker.Item label="GYR" value="GYR" />
            <Picker.Item label="HOLSTEIN" value="HOLSTEIN" />
            <Picker.Item label="JERSEY" value="JERSEY" />
            <Picker.Item label="NORMANDO" value="NORMANDO" />
            <Picker.Item label="7 COLORES" value="COLORES" />
            <Picker.Item label="GUREZÁ" value="GUREZÁ" />
            <Picker.Item label="GIROLANDO" value="GIROLANDO" />
          </Picker>

          <Text style={styles.text}>Corral</Text>
          <Picker
            style={styles.pickerStyle}
            itemStyle={styles.dropdownBtnStyle}
            mode="dropdown"
            selectedValue={farmyard}
            dropdownIconColor={'white'}
            onValueChange={selected => setFarmyard(selected)}>
            {itemPickerByFarmyard()}
          </Picker>

          <Text style={styles.text}>Tiempo Preñez</Text>
          <TextInput style={styles.input} placeholder='# Semanas, Ej. 4' onChangeText={setPregnancy} value={pregnancy} keyboardType="numeric" />

          <Text style={styles.text}>Enfermedad</Text>
          <Picker
            style={styles.pickerStyle}
            itemStyle={styles.dropdownBtnStyle}
            mode="dropdown"
            selectedValue={illness}
            dropdownIconColor={'white'}
            onValueChange={selected => sick(selected)}>
            <Picker.Item label="seleccionar Enfermedad..." value="" />
            <Picker.Item label="SI" value="SI" />
            <Picker.Item label="NO" value="NO" />
          </Picker>

          <Text style={[!showCauseIllness && { display: 'none' }, styles.text]}>Cual Enfermedad?</Text>
          <TextInput style={[!showCauseIllness && { display: 'none' }, styles.input]} onChangeText={setCauseIllness} value={causeIllness} keyboardType="default" />

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
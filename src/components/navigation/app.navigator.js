import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { Text } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';

const Stack = createStackNavigator();

import Livestock from "../livestock";
import Dashboard from "../dashboard";
import CreateCows from "../createCows";
import DetailsCows from "../detailsCow";
import EventsCows from "../events";
import History from "../history";
import ConnectionNetwork from "../syncUp";
import Equipment from "../equipment";
import ShowEquipment from "../showEquipment";
import importData from "../importData";
import Header from "../Header";

export const AppNavigator = () => {
  return (
    <>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Menu">
          <Stack.Screen name="Header" component={Header} options={{ headerShown: false }} />
          <Stack.Screen name="Menu" component={Dashboard} options={{ headerShown: false }} />
          <Stack.Screen name="Ganado" component={Livestock} options={{ headerShown: false }} />
          <Stack.Screen name="Detalles" component={DetailsCows} options={{ headerShown: false }} />
          <Stack.Screen name="Registrar" component={CreateCows} options={{ headerShown: false }} />
          <Stack.Screen name="trazabilidad" component={EventsCows} options={{ headerShown: false }} />
          <Stack.Screen name="Historial" component={History} options={{ headerShown: false }} />
          <Stack.Screen name="Sincronizacion" component={ConnectionNetwork} options={{ headerShown: false }} />
          <Stack.Screen name="Registrar Equipamiento" component={Equipment} options={{ headerShown: false }} />
          <Stack.Screen name="Mostrar Equipamiento" component={ShowEquipment} options={{ headerShown: false }} />
          <Stack.Screen name="ImportData" component={importData} options={{ headerShown: false }} />
        </Stack.Navigator>
        <Text style={{ alignSelf: 'flex-end', textAlign: 'right',padding: 5, backgroundColor: 'white', width: '100%' }}>Vesion : v1.0.0</Text>
      </NavigationContainer>
    </>

  );
};

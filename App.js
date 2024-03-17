import 'react-native-gesture-handler';
import React, {useEffect} from 'react';
import { StatusBar } from 'react-native';
import { Navigation } from './src/components/navigation/index'
import { initDatabase } from './src/utils/database';

export default function App() {

  const init = async () => {
    await initDatabase();
  }
  
  useEffect(() => { init(); },[])

  return (
    <>
      <StatusBar barStyle="light-content" />
      <Navigation />
    </>
  );
}
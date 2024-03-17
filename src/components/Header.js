import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  SafeAreaView,
  Image,
  Pressable
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

export default function App(props) {

  return (
    <>
      <SafeAreaView style={{ backgroundColor: 'black' }}>
        <StatusBar barStyle="light-content" />
        <View style={styles.navBar}>
          <Image
            style={styles.logo}
            source={require('../assets/Lgo.png')}
          />
          <Text style={styles.version}>
            <Pressable style={styles.buttonBack} onPress={() => props.directions.navigation.navigate('ImportData')}>
              <Icon name="download" size={20} color="white" />
            </Pressable>
          </Text>
        </View>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  logo: {
    flex: 1,
    flexDirection: 'row',
    alignSelf: 'flex-start',
    left: 0,
    bottom: 0,
    right: 0,
    top: 0,
    resizeMode: 'contain',
    left: -74
  },
  navBar: {
    backgroundColor: '#1d9555',
    width: '100%',
    height: 55,
  },
  version: {
    position: 'absolute',
    alignSelf: 'flex-end',
    color: 'white',
    top: 15,
    fontSize: 17,
    paddingRight: 17,
  },
  title: {
    fontWeight: 'bold',
    top: 11,
    left: 25,
    fontSize: 22,
    color: 'black'
  }
});

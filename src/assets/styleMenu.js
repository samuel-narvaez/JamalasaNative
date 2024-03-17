'use strict';
import { StyleSheet } from 'react-native';

module.exports = StyleSheet.create({
  view: {
    flex: 1,
    paddingTop: 5,
    paddingHorizontal: 10,
    backgroundColor: 'white',
    alignContent: 'center',
    justifyContent: 'center',
    height: '100%'
  },
  title: {
    backgroundColor: '#3CB371',
    borderTopLeftRadius: 9,
    borderTopRightRadius: 9,
  },
  textTitle: {
    position: 'absolute',
    color: 'black',
    fontSize: 18,
    padding: 4,
    fontWeight: 'bold',
    marginLeft: 70,
    marginTop: 7,
  },
  textIcon: {
    paddingVertical: 10,
    paddingLeft: 5,
    color: 'black',
  },
  card: {
    backgroundColor: 'white',
    marginHorizontal: 5,
    marginBottom: 12,
    marginTop: 12,
    borderWidth: 1,
    borderColor: '#3CB371',
    borderRadius: 10,
    width: '99%'
  },
  icons: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginHorizontal: 55
  },
  detailCard: {
    marginVertical: 5,
    left: 19,
    color: 'black',
    fontWeight: 'bold',
    fontSize: 15,
  },
  detailCardFarmyard: {
    marginVertical: 5,
    paddingRight: 5,
    color: 'black',
    fontWeight: 'bold',
    fontSize: 15,
    left: 250
  },
  logo: {
    width: 60,
    height: 60,
  },
  button: {
    marginBottom: 10,
    padding: 13,
    width: 50,
    textAlign: 'center',
    alignItems: 'center',
    left: 170,
    backgroundColor: 'transparent',
  },
  cardSelect: {
    backgroundColor: 'white',
    marginHorizontal: 5,
    marginBottom: 12,
    marginTop: 12,
    borderWidth: 1,
    borderColor: '#3CB371',
    borderRadius: 10,
    width: 281
  },
  buttonBack: {
    padding: 10,
    elevation: 2,
    width: 50,
    textAlign: 'center',
    alignItems: 'flex-start'
  },
  titleChart: {
    textAlign: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    color: 'black',
    fontWeight: 'bold',
    fontSize: 15
  },
  cardSync: {
    backgroundColor: 'white',
    marginHorizontal: 5,
    marginBottom: 12,
    marginTop: 12,
    borderWidth: 1,
    borderColor: '#90EE90',
    borderRadius: 10,
    width: 570
  },
  buttonSync: {
    marginBottom: 5,
    padding: 13,
    width: 50,
    textAlign: 'center',
    alignItems: 'center',
    left: 500,
    backgroundColor: 'transparent',
  },
  titleSync: {
    backgroundColor: '#90EE90',
    borderTopLeftRadius: 9,
    borderTopRightRadius: 9,
  },
  cardEquipment: {
    backgroundColor: 'white',
    marginHorizontal: 5,
    marginBottom: 12,
    marginTop: 12,
    borderWidth: 1,
    borderColor: '#3CB371',
    borderRadius: 10,
    width: '99%'
  },
  cardSell: {
    backgroundColor: 'white',
    marginHorizontal: 5,
    marginBottom: 12,
    marginTop: 12,
    borderWidth: 1,
    borderColor: '#3CB371',
    backgroundColor: '#3CB371',
    borderRadius: 10,
    width: '99%',
    flexDirection: 'column',
    height: 150,
    alignItems: 'center',
    justifyContent: 'center'
  },
  textSell: {
    color: 'black',
    padding: 4,
    fontWeight: 'bold'
  },
  headers: {
    width: 148,
    backgroundColor: 'white',
    height: 40,
    top: 10,
    alignContent: 'center',
    alignItems: 'center',
    borderBottomColor: 'black'
  },
  bodies: {
    width: 150,
    backgroundColor: '#90EE90',
    alignContent: 'center',
    alignItems: 'center',
    borderColor: '#90EE90',
  },
  buttonImport: {
    borderRadius: 10,
    marginBottom: 10,
    padding: 10,
    elevation: 2,
    width: '40%',
    textAlign: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    top: 100,
    color: 'white'
  },
  buttonClose: {
    backgroundColor: "#87CEFA",
  },
  textStyle: {
    color: "black",
    fontWeight: "bold"
  },
  buttonDeleteLiveStock: {
    marginBottom: 10,
    padding: 13,
    width: 50,
    textAlign: 'center',
    alignItems: 'center',
    left: 170,
    backgroundColor: 'transparent',
  },
  buttonSyncAll: {
    marginBottom: 10,
    padding: 13,
    width: '100%',
    textAlign: 'center',
    alignItems: 'center',
    height: 50,
  },
});
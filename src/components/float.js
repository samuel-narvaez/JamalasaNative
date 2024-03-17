import React, { useState, useEffect } from 'react';
import { FAB, Portal, Provider } from 'react-native-paper';
import { getDBConnection, getCows } from '../utils/database';
import { Alert} from 'react-native';
import NetInfo from "@react-native-community/netinfo";
import { Requests } from '../utils/databaseServer';
const petitions = new Requests();


export default function App(props) {
    const [state, setState] = useState({ open: false });
    const [isConnected, setIsConnected] = useState(false);

    const { open } = state;
    const onStateChange = ({ open }) => setState({ open });

    const loadDataCows = async () => {
        try {
            const db = await getDBConnection();
            const cowsFromDatabaseLocal = await getCows(db);
            await db.close();
            if (cowsFromDatabaseLocal.length > 0 || isConnected == false) {
                props.direction.navigation.navigate('Registrar');
            } else {
                if (isConnected) {
                    let response = await petitions.Cows();
                    if (response.data.length > 0) {
                        Alert.alert(
                            'ANUNCIO IMPORTANTE!',
                            'Ud debe primero actualizar los datos antes de crear un animal',
                            [{
                                text: 'Click para ir a actualizar los datos',
                                onPress: () => props.direction.navigation.navigate('ImportData')
                            }, {
                                text: 'Cerrar'
                            }]
                        )
                    } else {
                        props.direction.navigation.navigate('Registrar');
                    }
                }
            }
        } catch (error) {
            console.log(error.message);
        }
    }

    const options = (options) => {
        switch (options) {
            case 'Registrar Animal':
                loadDataCows();
                break;
            case 'Sincronizar':
                props.direction.navigation.navigate('Sincronizacion')
                break;
            case 'trazabilidad':
                props.direction.navigation.navigate('trazabilidad');
                break;
            case 'Historial':
                props.direction.navigation.navigate('Historial')
                break;
            case 'Registrar Equipamiento':
                props.direction.navigation.navigate('Registrar Equipamiento')
                break;
            case 'Mostrar Equipamiento':
                props.direction.navigation.navigate('Mostrar Equipamiento')
                break
            default:
                break;
        }
    }

    useEffect(() => {
        const unsubscribe = NetInfo.addEventListener(state => {
            setIsConnected(state.isConnected);
        });

        return () => {
            unsubscribe();
        }
    }, []);

    return (
        <Provider>
            <Portal>
                <FAB.Group
                    open={open}
                    visible
                    icon={open ? 'close' : 'plus'}
                    actions={[
                        { icon: 'plus', label: 'Registrar Animal', onPress: () => options('Registrar Animal') },
                        { icon: 'calendar', label: 'Registrar Movimiento', onPress: () => options('trazabilidad') },
                        { icon: 'book', label: 'Historial', onPress: () => options('Historial') },
                        { icon: 'database', label: 'Sincronizar', onPress: () => options('Sincronizar') },
                        { icon: 'hammer', label: 'Registrar Equipamiento', onPress: () => options('Registrar Equipamiento') },
                        { icon: 'warehouse', label: 'Mostrar Equipamiento', onPress: () => options('Mostrar Equipamiento') }
                    ]}
                    onStateChange={onStateChange}
                    onPress={() => { }}
                />
            </Portal>
        </Provider>
    );
};
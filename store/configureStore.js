import { createStore, combineReducers } from 'redux';
import utilsReduces from '../reducers/utilsReducer';
const rootReducer = combineReducers({ products: utilsReduces });

const configureStore = () => {
    return createStore(rootReducer);
}
export default configureStore;
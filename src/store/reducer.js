import { combineReducers } from 'redux';

// reducer import
import customizationReducer from './customizationReducer';
import dataReducer from './reducers/dataReducer';

// ==============================|| COMBINE REDUCER ||============================== //

const reducer = combineReducers({
    customization: customizationReducer,
    data: dataReducer
});

export default reducer;

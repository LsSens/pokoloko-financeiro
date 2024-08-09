import { SET_TARGET_YEAR, SET_TARGET_MONTH, SET_ALL_DATA, SET_SELECT_DATA, SET_USER, SET_ERROR } from '../actions/types';

const initialState = {
    targetYear: null,
    targetMonth: null,
    allData: [],
    selectData: [],
    user: null,
    error: null
};

const dataReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_TARGET_YEAR:
            return {
                ...state,
                targetYear: action.payload
            };
        case SET_TARGET_MONTH:
            return {
                ...state,
                targetMonth: action.payload
            };
        case SET_ALL_DATA:
            return {
                ...state,
                allData: action.payload
            };
        case SET_SELECT_DATA:
            return {
                ...state,
                selectData: action.payload
            };
        case SET_USER:
            return {
                ...state,
                user: action.payload
            };
        case SET_ERROR:
            return {
                ...state,
                error: action.payload
            };
        default:
            return state;
    }
};

export default dataReducer;

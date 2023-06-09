import React from "react"
import { createStore, combineReducers } from "redux"
import { Provider, connect } from "react-redux"

const initialState = {
  items: []
};

const raspunsuriReducer = (state=initialState, action) => {
  switch (action.type) {
    case 'ADD_ITEM':
      return {
        ...state,
        items: [...state.items, action.payload]
      };
      case 'UPDATE_ITEM':
        return {
          ...state,
          items: state.items.map(item =>
            item.id === action.payload.id ? action.payload : item
          )
        };
      case 'DELETE_ITEM':
        return {
          ...state,
          items: state.items.filter(item => item.id !== action.payload)
        };
      default:
        return state;
  }
};

const textReducer = ( state = "", action )=> {
  switch (action.type) {
    case " update":
      return action.payload
      default:
        return state
  }
}

const combinedReducers = combineReducers({
  raspunsuri: raspunsuriReducer,
  text: textReducer
})

const store = createStore(combinedReducers)

export default function StoreComponent({ children }) {
  return <Provider store={store}>{children}</Provider>;
}

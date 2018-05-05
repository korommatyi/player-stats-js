import * as React from "react";
import * as ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { createStore, applyMiddleware } from "redux";
import thunkMiddleware from 'redux-thunk';
import { createLogger } from 'redux-logger';
import rootReducer from "./reducers";
import { setupFirebaseConnection } from "./actions";

const store = createStore(
  rootReducer,
  applyMiddleware(
    thunkMiddleware
  )
);

store.dispatch(setupFirebaseConnection());


ReactDOM.render(
    <div>Hello bello!</div>,
    document.getElementById("app")
);

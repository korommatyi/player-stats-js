import * as React from "react";
import * as ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { createStore, applyMiddleware } from "redux";
import thunkMiddleware from 'redux-thunk';
import { createLogger } from 'redux-logger';
import rootReducer from "./reducers";
import { setupFirebaseConnection } from "./actions";
import Games from "./game-list";
import AppBar from "./app-bar";
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import blue from '@material-ui/core/colors/blue';

const theme = createMuiTheme({
  palette: {
    primary: blue,
  },
});

const store = createStore(
  rootReducer,
  applyMiddleware(
    thunkMiddleware
  )
);

store.dispatch(setupFirebaseConnection());

ReactDOM.render(
  <MuiThemeProvider theme={theme}>
    <Provider store={store}>
      <div>
        <AppBar/>
        <Games/>
      </div>
    </Provider>
  </MuiThemeProvider>,
  document.getElementById("app")
);

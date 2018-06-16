import * as React from "react";
import * as ReactDOM from "react-dom";
import { Provider, connect } from "react-redux";
import { createStore, applyMiddleware } from "redux";
import thunkMiddleware from 'redux-thunk';
import { createLogger } from 'redux-logger';
import rootReducer from "./reducers";
import { setupFirebaseConnection } from "./actions";
import Games from "./game-list";
import AppBar from "./app-bar";
import Dashboard from "./dashboard";
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import blue from '@material-ui/core/colors/blue';
import { Page, UiState } from "./data-model";

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

store.dispatch<any>(setupFirebaseConnection());

const Pages = connect(
  (state: { uiState: UiState }) => ({ activePage: state.uiState.get('activePage') as Page })
)(({ activePage }: { activePage: Page }) => {
  switch (activePage) {
    case Page.Dashboard:
      return <Dashboard/>
    case Page.Edit:
      return <div/>
    case Page.List:
      return <Games/>
    default:
      return <div/>
  }});

ReactDOM.render(
  <MuiThemeProvider theme={theme}>
    <Provider store={store}>
      <div>
        <AppBar/>
        <Pages/>
      </div>
    </Provider>
  </MuiThemeProvider>,
  document.getElementById("app")
);

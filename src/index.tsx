import * as React from "react";
import * as ReactDOM from "react-dom";
import { Provider } from "mobx-react";
import AppBar from "./app-bar";
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import blue from '@material-ui/core/colors/blue';
import { Page, UIState } from "./ui-state";

const theme = createMuiTheme({
  palette: {
    primary: blue,
  },
});

/* const Pages = connect(
 *   (state: { uiState: UiState }) => ({ activePage: state.uiState.activePage })
 * )(({ activePage }: { activePage: Page }) => {
 *   switch (activePage) {
 *     case Page.Dashboard:
 *       return <Dashboard/>
 *     case Page.Edit:
 *       return <div/>
 *     case Page.List:
 *       return <Games/>
 *     default:
 *       return <div/>
 *   }}) */;

const uiState = new UIState({ on: (a, b) => console.log(a, b) });

ReactDOM.render(
  <MuiThemeProvider theme={theme}>
    <Provider uiState={uiState}>
      <div>
        <AppBar/>
      </div>
    </Provider>
  </MuiThemeProvider>,
  document.getElementById("app")
);

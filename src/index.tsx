import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider, inject, observer } from 'mobx-react';
import AppBar from './app-bar';
import Games from './game-list';
import Dashboard from './dashboard';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import blue from '@material-ui/core/colors/blue';
import { Page, UIState, UIStateProp } from './ui-state';
import { init, gamesRef } from './firebase';

const theme = createMuiTheme({
  palette: {
    primary: blue,
  },
});

@inject('uiState')
@observer
class Pages extends React.Component<UIStateProp> {
  uiState: UIState

  constructor(props: UIStateProp) {
    super(props);
    this.uiState = props.uiState!;
  }

  render() {
    switch (this.uiState.page) {
      case Page.Dashboard:
        return <Dashboard/>
      case Page.Edit:
        return <div/>
      case Page.List:
        return <Games/>
      default:
        return <div/>
    }}
}

init();
const uiState = new UIState(gamesRef());

ReactDOM.render(
  <MuiThemeProvider theme={theme}>
    <Provider uiState={uiState}>
      <div>
        <AppBar/>
        <Pages/>
      </div>
    </Provider>
  </MuiThemeProvider>,
  document.getElementById('app')
);

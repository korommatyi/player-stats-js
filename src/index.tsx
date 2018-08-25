import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider, inject, observer } from 'mobx-react';
import AppBar from './app-bar';
import Games from './game-list';
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
  render() {
    switch (this.props.uiState.page) {
      case Page.Dashboard:
        return <div/>
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

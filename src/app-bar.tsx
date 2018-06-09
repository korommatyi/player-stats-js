import * as React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import Icon from '@material-ui/core/Icon';
import { Page, UiState } from './data-model';
import { connect } from 'react-redux';

const styles = {
  root: {
    flexGrow: 1,
  },
  flex: {
    flex: 1,
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20,
  },
};

class Header extends React.Component {
  constructor(props: { activePage: Page, onSelect: (newPage: Page) => void}) {
    super(props);
    this.state = { open: false };
  }

  menuClick() {
    this.setState((prevState) => {
      console.log(!prevState.open);
      return { open: !prevState.open }
    })
  }

  click(page: Page) {
    this.setState({ open: false });
  }

  render() {
    return (
      <div style={styles.root}>
        <AppBar position="static">
          <Toolbar>
            <IconButton style={styles.menuButton} color="inherit" aria-label="Menu"
                        onClick={this.menuClick.bind(this)}>
              <Icon>menu</Icon>
            </IconButton>
            <Typography variant="title" color="inherit" style={styles.flex}>
              {this.props.activePage}
            </Typography>
          </Toolbar>
        </AppBar>
      </div>
    );
  }
}

export default connect(
  (state: { uiState: UiState }) => ({ activePage: (state.uiState.get('activePage') as Page) }),
  (dispatch) => ({ onSelect: (newPage: Page) => console.log(newPage) })
)(Header);

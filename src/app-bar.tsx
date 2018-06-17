import * as React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import Icon from '@material-ui/core/Icon';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import { Page, UiState } from './data-model';
import {navigate } from './actions';
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

interface PageItemProps {
  icon: string,
  page: Page,
  onClick: (page: Page) => void,
}

class PageItem extends React.Component<PageItemProps, {}> {
  constructor(props: PageItemProps) {
    super(props);
  }

  onClick() {
    this.props.onClick(this.props.page);
  }

  render() {
    return (
      <ListItem button onClick={this.onClick.bind(this)}>
        <ListItemIcon>
          <Icon>{this.props.icon}</Icon>
        </ListItemIcon>
        <ListItemText primary={this.props.page}/>
      </ListItem>
    );
  }
}

interface HeaderStateProps {
  activePage: Page,
}

interface HeaderDispatchProps {
  onSelect: (newPage: Page) => void,
}

type HeaderProps = HeaderStateProps & HeaderDispatchProps;

interface HeaderState {
  open: boolean
}

class Header extends React.Component<HeaderProps, HeaderState> {
  constructor(props: HeaderProps) {
    super(props);
    this.state = { open: false };
    this.toggleMenu = this.toggleMenu.bind(this);
    this.closeDrawer = this.closeDrawer.bind(this);
    this.selectPage = this.selectPage.bind(this);
  }

  toggleMenu() {
    this.setState((prevState) => {
      return { open: !prevState.open }
    })
  }

  closeDrawer() {
    this.setState({ open: false});
  }

  selectPage(page: Page) {
    this.props.onSelect(page);
    this.closeDrawer();
  }

  render() {
    return (
      <div style={styles.root}>
        <AppBar position="static">
          <Toolbar>
            <IconButton style={styles.menuButton} color="inherit" aria-label="Menu"
                        onClick={this.toggleMenu}>
              <Icon>menu</Icon>
            </IconButton>
            <Typography variant="title" color="inherit" style={styles.flex}>
              {this.props.activePage}
            </Typography>
          </Toolbar>
        </AppBar>
        <Drawer anchor="left" open={this.state.open} onClick={this.closeDrawer}>
          <div tabIndex={0}
               role="button"
               onClick={this.closeDrawer}
               onKeyDown={this.closeDrawer}>
            <List>
              <PageItem icon="equalizer" page={Page.Dashboard} onClick={this.selectPage}/>
              <PageItem icon="add circle" page={Page.Edit} onClick={this.selectPage}/>
              <PageItem icon="list" page={Page.List} onClick={this.selectPage}/>
            </List>
          </div>
        </Drawer>
      </div>
    );
  }
}

export default connect<HeaderStateProps, HeaderDispatchProps>(
  (state: { uiState: UiState }) => ({ activePage: (state.uiState.activePage) }),
  (dispatch) => ({ onSelect: (newPage: Page) => dispatch(navigate(newPage)) })
)(Header);

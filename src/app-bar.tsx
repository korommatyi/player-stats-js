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
import { Page, UIStateProp } from './ui-state';
import { observer, inject } from 'mobx-react';
import { observable, action } from 'mobx';

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

const PageItem = (props: { onClick: (page: Page) => void, icon: string, page: Page }) => (
  <ListItem button onClick={() => props.onClick(props.page)}>
    <ListItemIcon>
      <Icon>{props.icon}</Icon>
    </ListItemIcon>
    <ListItemText primary={props.page}/>
  </ListItem>
);


@inject('uiState')
@observer
export default class Header extends React.Component<UIStateProp> {
  @observable open = false;

  @action.bound
  selectPage(page: Page) {
    this.props.uiState.page = page;
    this.open = false;
  }

  render() {
    return (
      <div style={styles.root}>
        <AppBar position="static">
          <Toolbar>
            <IconButton style={styles.menuButton} color="inherit" aria-label="Menu"
                        onClick={() => this.open = !this.open}>
              <Icon>menu</Icon>
            </IconButton>
            <Typography variant="title" color="inherit" style={styles.flex}>
              {this.props.uiState.page}
            </Typography>
          </Toolbar>
        </AppBar>
        <Drawer anchor="left" open={this.open} onClick={() => this.open = false}>
          <div tabIndex={0}
               role="button"
               onClick={() => this.open = false}
               onKeyDown={() => this.open = false}>
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

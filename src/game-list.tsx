import Table from '@material-ui/core/Table';
import Paper from '@material-ui/core/Paper';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import TableBody from '@material-ui/core/TableBody';
import Icon from '@material-ui/core/Icon';
import { Team, Record } from './data-model';
import * as React from 'react';
import { inject, observer } from 'mobx-react';

function resultIcon(r: string): string {
  switch (r) {
    case 'team-a-won':
      return 'keyboard_arrow_right';
    case 'team-b-won':
      return 'keyboard_arrow_left';
    default:
      return 'drag_handle';
  }
}

const Row = ({ r }: { r: Record }) => (
  <TableRow>
    <TableCell>{r.date}</TableCell>
    <TableCell>{r[Team.A].join(', ')}</TableCell>
    <TableCell><Icon>{resultIcon(r.result)}</Icon></TableCell>
    <TableCell>{r[Team.B].join(', ')}</TableCell>
  </TableRow>
);

@inject('uiState')
@observer
export default class GamesList extends React.Component {
  render() {
    return (
      <Paper>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell>The Awesomes</TableCell>
              <TableCell/>
              <TableCell>The Geniuses</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {
              this.props.uiState.reverseSortedGamesWithKeys
                  .map(([k, v]: [number, Record]) => (
                    <Row key={k} r={v}/>
                  ))
            }
          </TableBody>
        </Table>
      </Paper>
    );
  }
};

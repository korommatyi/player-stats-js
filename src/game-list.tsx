import Table from "@material-ui/core/Table"
import Paper from "@material-ui/core/Paper"
import TableHead from "@material-ui/core/TableHead"
import TableRow from "@material-ui/core/TableRow"
import TableCell from "@material-ui/core/TableCell"
import TableBody from "@material-ui/core/TableBody"
import Icon from "@material-ui/core/Icon"
import { Data, Team, Record } from "./data-model"
import { connect } from "react-redux"
import * as React from "react"

function resultIcon(r: string): string {
  switch (r) {
    case "team-a-won":
      return "keyboard_arrow_right";
    case "team-b-won":
      return "keyboard_arrow_left";
    default:
      return "drag_handle";
  }
}

const Row = ({ r }: { r: Record }) => (
  <TableRow>
    <TableCell>{r.date}</TableCell>
    <TableCell>{r[Team.A].join(", ")}</TableCell>
    <TableCell><Icon>{resultIcon(r.result)}</Icon></TableCell>
    <TableCell>{r[Team.B].join(", ")}</TableCell>
  </TableRow>
);

function reverseDateSorter(a: [number, Record], b: [number, Record]) {
  return b[1].date.localeCompare(a[1].date);
}

const Games = ({ rawData }: { rawData: Data }) => (
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
        {Object.entries(rawData).sort(reverseDateSorter).map(([k, v]: [number, Record]) => (
          <Row key={k} r={v}/>
        ))}
      </TableBody>
    </Table>
  </Paper>
);

export default connect(
  (state: { rawData: Data }) => ({ rawData: state.rawData })
)(Games);

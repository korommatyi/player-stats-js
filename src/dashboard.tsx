import * as React from 'react';
import { connect } from 'react-redux';
import { Line, Scatter } from 'react-chartjs-2';
import SetterPanel from './setter-panel';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import Icon from '@material-ui/core/Icon';
import { createStyles } from '@material-ui/core/styles';

const Chart = () => (
  <div style={{position: "relative",
               width: "100vw",
               margin: "auto",
               minWidth: 200,
               flex: 1}}>
    <Line data={{datasets: [{ data: [20, 10] }]}}/>
  </div>
)

const Dashboard = () => (
  <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between',
               margin: '2% auto'}}>
    <Chart/>
    <SetterPanel/>
  </div>
)

export default Dashboard;

import * as React from 'react';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';

const styles = {
  axisSetter: {
    marginTop: "2%"
  },
  setterPanel: {
    flexStyle: "column",
    margin: "0 2%",
    justifyContent: "flex-start"
  }
}

const AxisSetter = () => (
  <Card style={styles.axisSetter}>
    <CardHeader title="Hello"/>
    <CardContent/>
  </Card>
)

const SetterPanel = () => (
  <div style={styles.setterPanel}>
    <AxisSetter/>
    <AxisSetter/>
  </div>
)

export default SetterPanel;

import * as React from 'react';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import Icon from '@material-ui/core/Icon';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Switch from '@material-ui/core/Switch';
import TextField from '@material-ui/core/TextField';
import { createStyles } from '@material-ui/core/styles';
import { Filter, Metric, Axis, UIState } from './ui-state';
import { inject, observer } from 'mobx-react';
import { observable, action } from 'mobx';


const styles = createStyles({
  setterPanel: {
    flexStyle: "column",
    margin: "0 2%",
    justifyContent: "flex-start"
  },
  axisSetter: {
    marginTop: "2%"
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start'
  }
});

interface NumFieldProps {
  value: number,
  disabled: boolean,
  onChange: (value: number) => void
}

@observer
class NumField extends React.Component<NumFieldProps> {
  @observable value = '';
  @observable error = false;

  constructor(props: NumFieldProps) {
    super(props);
    this.value = props.value.toString();
  }

  @action.bound
  onChange(newValue: string) {
    this.value = newValue;
    const valueNum = Number(newValue);
    const valid = !!valueNum && valueNum > 0;
    this.error = !valid;
    if (valid) {
      this.props.onChange(valueNum);
    }
  }

  render() {
    return (
      <TextField error={this.error} value={this.value} disabled={this.props.disabled}
                 onChange={ event => this.onChange(event.target.value) }
                 style={{width: '4em'}} />
    )
  }
}

interface SetterProps<T> {
  on: boolean,
  value: T,
  onToggle: (state: boolean) => void,
  onValueChange: (value: T) => void
}

type FilterSetterProps = SetterProps<Filter>;

const FilterSetter = ({ on, value, onToggle, onValueChange }: FilterSetterProps) => (
  <div style={styles.row}>
    <Switch checked={on}
            onChange={ event => onToggle(event.target.checked) } color='primary'/>
    <div style={{paddingRight: '1em'}}>Use filter</div>
    <Select value={value} onChange={ event => onValueChange(event.target.value as Filter) }
            disabled={!on}>
      {Object.values(Filter).map(f => <MenuItem value={f} key={f}>{f}</MenuItem>)}
    </Select>
  </div>
)

type NumericAttrSetterProps = SetterProps<number>;

const WindowSetter = ({ on, value, onToggle, onValueChange }: NumericAttrSetterProps) => (
  <div style={styles.row}>
    <Switch checked={on}
            onChange={ event => onToggle(event.target.checked) } color='primary'/>
    <div style={{paddingRight: '1em'}}>Use a sliding window of size</div>
    <NumField value={value} onChange={onValueChange} disabled={!on}/>
  </div>
)

const LastGamesSetter = ({ on, value, onToggle, onValueChange }: NumericAttrSetterProps) => (
  <div style={styles.row}>
    <Switch checked={on}
            onChange={ event => onToggle(event.target.checked) } color='primary'/>
    <div style={{paddingRight: '1em'}}>Show scores from last</div>
    <NumField value={value} onChange={onValueChange} disabled={!on}/>
    <div style={{paddingLeft: '1em'}}>games</div>
  </div>
)

function metricOptions(axis: Axis) {
  return axis == Axis.X ? Object.values(Metric) : [Metric.EloRating, Metric.WinRate];
}


@inject('uiState')
@observer
class AxisSetter extends React.Component<{ uiState: UIState, axis: Axis }> {
  render() {
    const options = this.props.uiState[this.props.axis];
    return (
      <Card style={styles.axisSetter}>
        <CardHeader title={this.props.axis == Axis.X ? 'X - axis' : 'Y - axis'}
                    avatar={<Icon>tune</Icon>}/>
        <CardContent>
          <Select value={options.metric} style={{minWidth: '20em'}}
                  onChange={ event => options.metric = (event.target.value as Metric) }>
            { metricOptions(this.props.axis).map(t => <MenuItem value={t} key={t}>{t}</MenuItem>) }
          </Select>
          { (options.metric == Metric.Time) ? (
              <LastGamesSetter on={options.recentGames} value={options.recentGameCount}
                               onToggle={() => options.recentGames = !options.recentGames}
                               onValueChange={v => options.recentGameCount = v} />
          ) : (
              <div>
                <FilterSetter on={options.filter} value={options.filterValue}
                              onToggle={() => options.filter = !options.filter}
                              onValueChange={v => options.filterValue = v}/>
                <WindowSetter on={options.windows} value={options.windowSize}
                              onToggle={() => options.windows = !options.windows}
                              onValueChange={v => options.windowSize = v} />
              </div>
          ) }
        </CardContent>
      </Card>
    );
  }
}

const SetterPanel = () => (
  <div style={styles.setterPanel}>
    <AxisSetter axis={Axis.Y}/>
    <AxisSetter axis={Axis.X}/>
  </div>
)

export default SetterPanel;

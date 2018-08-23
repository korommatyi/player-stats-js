import * as React from 'react';
import { connect } from 'react-redux';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import Icon from '@material-ui/core/Icon';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Switch from '@material-ui/core/Switch';
import TextField from '@material-ui/core/TextField';
import { createStyles } from '@material-ui/core/styles';
import { Filter, Metric, UiState, Axis } from './data-model';
import { setMetric, toggleWindows, setWindowSize, toggleFilter, setFilter,
         toggleRecentGames, setRecentGameCount } from './actions';

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
  onChange: (value: number) => void
}

class NumField extends React.Component<NumFieldProps, { value: string, error: boolean}> {
  constructor(props: NumFieldProps) {
    super(props);
    this.state = { value: props.value.toString(10), error: false };
    this.onChange = this.onChange.bind(this);
  }

  onChange(newValue: string) {
    const valueNum = Number(newValue);
    const valid = !!valueNum && valueNum > 0;
    this.setState({ value: newValue, error: !valid });
    if (valid) {
      this.props.onChange(valueNum);
    }
  }

  render() {
    return (
      <TextField error={this.state.error} value={this.state.value}
                 onChange={ event => this.onChange(event.target.value) }
                 style={{width: '4em'}} />
    )
  }
}

interface FilterSetterProps {
  on: boolean,
  value: Filter,
  onToggle: (state: boolean) => void,
  onValueChange: (filter: Filter) => void
}

const FilterSetter = ({ on, value, onToggle, onValueChange }: FilterSetterProps) => (
  <div style={styles.row}>
    <Switch checked={on}
            onChange={(event) => onToggle(event.target.checked)} color='primary'/>
    <div style={{paddingRight: '1em'}}>Use filter</div>
    <Select value={value} onChange={ event => onValueChange(event.target.value as Filter) }>
      {Object.values(Filter).map(f => <MenuItem value={f} key={f}>{f}</MenuItem>)}
    </Select>
  </div>
)

interface NumericAttrSetterProps {
  on: boolean,
  value: number,
  onToggle: (state: boolean) => void,
  onValueChange: (value: number) => void
}

const WindowSetter = ({ on, value, onToggle, onValueChange }: NumericAttrSetterProps) => (
  <div style={styles.row}>
    <Switch checked={on}
            onChange={ event => onToggle(event.target.checked) } color='primary'/>
    <div style={{paddingRight: '1em'}}>Use a sliding window of size</div>
    <NumField value={value} onChange={onValueChange} />
  </div>
)

const LastGamesSetter = ({ on, value, onToggle, onValueChange }: NumericAttrSetterProps) => (
  <div style={styles.row}>
    <Switch checked={on}
            onChange={ event => onToggle(event.target.checked) } color='primary'/>
    <div style={{paddingRight: '1em'}}>Show scores from last</div>
    <NumField value={value} onChange={onValueChange} />
    <div style={{paddingLeft: '1em'}}>games</div>
  </div>
)

interface YAxisSetterProps {
  metric: Metric,
  filter: boolean
  filterValue: Filter,
  windows: boolean,
  windowSize: number,
  onMetricChange: (metric: Metric) => void,
  onTogglingFilters: (state: boolean) => void,
  onSettingFilter: (filter: Filter) => void,
  onTogglingWindows: (state: boolean) => void,
  onSettingWindowSize: (size: number) => void
}

interface XAxisSetterProps extends YAxisSetterProps {
  recentGames: boolean,
  recentGameCount: number,
  onTogglingRecentGames: (state: boolean) => void,
  onSettingRecentGamesSize: (size: number) => void,
}

type AxisSetterProps = YAxisSetterProps | XAxisSetterProps;

function isX(props: AxisSetterProps): props is XAxisSetterProps {
  return (props as XAxisSetterProps).recentGames !== undefined;
}

function metricOptions(props: AxisSetterProps) {
  return isX(props) ? Object.values(Metric) : [Metric.EloRating, Metric.WinRate];
}

const AxisSetter = (props: AxisSetterProps) => (
  <Card style={styles.axisSetter}>
    <CardHeader title={isX(props) ? 'X - axis' : 'Y - axis'} avatar={<Icon>tune</Icon>}/>
    <CardContent>
      <Select value={props.metric} style={{minWidth: '20em'}}
              onChange={ event => props.onMetricChange(event.target.value as Metric) }>
        { metricOptions(props).map(t => <MenuItem value={t} key={t}>{t}</MenuItem>) }
      </Select>
      { (isX(props) && props.metric == Metric.Time) ? (
          <LastGamesSetter on={props.recentGames} value={props.recentGameCount}
                           onToggle={props.onTogglingRecentGames}
                           onValueChange={props.onSettingRecentGamesSize} />
      ) : (
          <div>
            <FilterSetter on={props.filter} value={props.filterValue}
                          onToggle={props.onTogglingFilters} onValueChange={props.onSettingFilter}/>
            <WindowSetter on={props.windows} value={props.windowSize}
                          onToggle={props.onTogglingWindows}
                          onValueChange={props.onSettingWindowSize} />
          </div>
      ) }
    </CardContent>
  </Card>
)

const YAxisSetter = connect(
  (state: { uiState: UiState }) => (state.uiState.dashboard[Axis.Y] as YAxisSetterProps),
  (dispatch) => ({
    onMetricChange: (metric: Metric) => dispatch(setMetric(Axis.Y, metric)),
    onSettingFilter: (filter: Filter) => dispatch(setFilter(Axis.Y, filter)),
    onTogglingFilters: (state: boolean) => dispatch(toggleFilter(Axis.Y, state)),
    onSettingWindowSize: (size: number) => dispatch(setWindowSize(Axis.Y, size)),
    onTogglingWindows: (state: boolean) => dispatch(toggleWindows(Axis.Y, state))
  })
)(AxisSetter);

const XAxisSetter = connect(
  (state: { uiState: UiState }) => (state.uiState.dashboard[Axis.X] as XAxisSetterProps),
  (dispatch) => ({
    onMetricChange: (metric: Metric) => dispatch(setMetric(Axis.X, metric)),
    onSettingFilter: (filter: Filter) => dispatch(setFilter(Axis.X, filter)),
    onTogglingFilters: (state: boolean) => dispatch(toggleFilter(Axis.X, state)),
    onSettingWindowSize: (size: number) => dispatch(setWindowSize(Axis.X, size)),
    onTogglingWindows: (state: boolean) => dispatch(toggleWindows(Axis.X, state)),
    onSettingRecentGamesSize: (size: number) => dispatch(setRecentGameCount(Axis.X, size)),
    onTogglingRecentGames: (state: boolean) => dispatch(toggleRecentGames(Axis.X, state)),
  })
)(AxisSetter);

const SetterPanel = () => (
  <div style={styles.setterPanel}>
    <YAxisSetter />
    <XAxisSetter />
  </div>
)

export default SetterPanel;

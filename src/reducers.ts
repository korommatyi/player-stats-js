import { combineReducers } from "redux"
import { ActionType, Team, Result, Axis, Metric, Page, UiState,
         initialUiState, Data, Record } from "./data-model"
import { Action } from './actions'

const empty = new Map<number, Record>();

function rawData(state: Data = empty, action: Action) {
  switch (action.type) {
    case ActionType.SetRawData:
      return new Map(Object.entries(action.data))
    default:
      return state
  }
}

function updateDashboard<T>(state: UiState, axis: Axis, attr: string, value: T) {
  const axisState = Object.assign({}, state.dashboard[axis], { [attr]: value });
  const dashboard = Object.assign({}, state.dashboard, { [axis]: axisState });
  return Object.assign({}, state, { dashboard: dashboard });
}

function addToTeam(state: UiState, team: Team, name: string) {
  const teamState = state.edit[team].push(name);
  const edit = Object.assign({}, state.edit, { [team]: teamState });
  return Object.assign({}, state, { edit: edit });
}

function setResult(state: UiState, result: Result) {
  const edit = Object.assign({}, state.edit, { result: result });
  return Object.assign({}, state, { edit: edit });
}

function setDate(state: UiState, date: Date) {
  const edit = Object.assign({}, state.edit, { date: date });
  return Object.assign({}, state, { edit: edit });
}
  

function uiState(state = initialUiState, action: Action) {
  switch (action.type) {
    case ActionType.AddToTeam:
      return addToTeam(state, action.team, action.name);
    case ActionType.SetResult:
      return setResult(state, action.result);
    case ActionType.SetDate:
      return setDate(state, action.date);
    case ActionType.SetMetric:
      return updateDashboard(state, action.axis, 'metric', action.metric);
    case ActionType.ToggleWindows:
      return updateDashboard(state, action.axis, 'windows', action.state);
    case ActionType.SetWindowSize:
      return updateDashboard(state, action.axis, 'windowSize', action.size);
    case ActionType.ToggleFilter:
      return updateDashboard(state, action.axis, 'filter', action.state);
    case ActionType.SetFilter:
      return updateDashboard(state, action.axis, 'filterValue', action.filter);
    case ActionType.ToggleRecentGames:
      return updateDashboard(state, action.axis, 'recentGames', action.state);
    case ActionType.SetRecentGameCount:
      return updateDashboard(state, action.axis, 'recentGameCount', action.count);
    case ActionType.Navigate:
      return Object.assign({}, state, { activePage: action.page });
    default:
      return state;
  }
}

export default combineReducers({
  rawData,
  uiState
})

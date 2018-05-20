import { combineReducers, Action } from "redux"
import { ActionType, Team, Result, Axis, Metric, Page, UiState,
         initialUiState, Data } from "./data_model"

function rawData(state: Data = {}, action: Action) {
  switch (action.type) {
    case ActionType.SetRawData:
      return action.data
    default:
      return state
  }
}

function toggle(state: UiState, axis: Axis, option: string) {
  return state.updateIn(["dashboard", axis, option], (s: boolean) => !s);
}

function uiState(state = initialUiState, action: Action) {
  switch (action.type) {
    case ActionType.AddToTeam:
      return state.updateIn(["edit", action.team], list => list.push(action.name));
    case ActionType.SetResult:
      return state.setIn(["edit", "result"], action.result);
    case ActionType.SetDate:
      return state.setIn(["edit", "date"], action.date);
    case ActionType.SetMetric:
      return state.setIn(["dashboard", action.axis, "metric"], action.metric);
    case ActionType.ToggleWindows:
      return toggle(state, action.axis, "windows");
    case ActionType.SetWindowSize:
      return state.setIn(["dashboard", action.axis, "windowSize"], action.size);
    case ActionType.ToggleEqualTeams:
      return toggle(state, action.axis, "equalTeams");
    case ActionType.SetTeamSize:
      return state.setIn(["dashboard", action.axis, "teamSize"], action.size);
    case ActionType.ToggleRecentGames:
      return toggle(state, action.axis, "recentGames");
    case ActionType.SetRecentGameCount:
      return state.setIn(["dashboard", action.axis, "recentGameCount"], action.count);
    default:
      return state;
  }
}

export default combineReducers({
  rawData,
  uiState
})

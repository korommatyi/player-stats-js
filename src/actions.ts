import { init, onDataChange } from "./firebase"
import { Dispatch } from "redux"

export enum ActionType {
  AddToTeam,
  SetResult,
  SetDate,
  Save,
  SetMetric,
  ToggleWindows,
  SetWindowSize,
  ToggleEqualTeams,
  SetTeamSize,
  ToggleRecentGames,
  SetRecentGameCount,
  Navigate,
  Login,
  SetRawData,
}

export enum Team {
  A = "team-a",
  B = "team-b",
}

export enum Result {
  TeamAWon = "team-a-won",
  TeamBWon = "team-b-won",
  Draw = "draw",
}

export enum Axis {
  X,
  Y,
}

export enum Metric {
  WinRate,
  EloRating,
  Time,
}

export enum Page {
  Dashboard,
  Edit,
  List,
}

export const addToTeam = (team: Team, name: string) => ({
  type: ActionType.AddToTeam,
  team: team,
  name: name
})

export const setResult = (result: Result) => ({
  type: ActionType.SetResult,
  result: result
})

export const setDate = (date: Date) => ({
  type: ActionType.SetDate,
  date: date
})

export const setMetric = (axis: Axis, metric: Metric) => ({
  type: ActionType.SetMetric,
  axis: axis,
  metric: metric
})

export const toggleWindows = (axis: Axis) => ({
  type: ActionType.ToggleWindows,
  axis: axis
})

export const setWindowSize = (axis: Axis, size: number) => ({
  type: ActionType.SetWindowSize,
  axis: axis,
  size: size
})

export const toggleEqualTeams = (axis: Axis) => ({
  type: ActionType.ToggleEqualTeams,
  axis: axis
})

export const setTeamSize = (axis: Axis, size: number) => ({
  type: ActionType.SetTeamSize,
  axis: axis,
  size: size
})

export const save = () => ({ type: ActionType.Save })

export const toggleRecentGames = (axis: Axis) => ({
  type: ActionType.ToggleRecentGames,
  axis: axis
})

export const setRecentGameCount = (axis: Axis, count: number) => ({
  type: ActionType.SetRecentGameCount,
  axis: axis,
  count: count
})

export const navigate = (page: Page) => ({
  type: ActionType.Navigate,
  page: page
})

const setRawData = (data: any) => ({
  type: ActionType.SetRawData,
  data: data
})

export function setupFirebaseConnection() {
  return function(dispatch: Dispatch) {
    init();
    onDataChange(data => dispatch(setRawData(data)));
  }
}   

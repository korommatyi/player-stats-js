import { init, onDataChange } from "./firebase"
import { ActionType, Team, Result, Axis, Metric, Page, Data } from "./data-model"
import { Dispatch } from "redux"

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

const setRawData = (data: Data) => ({
  type: ActionType.SetRawData,
  data: data
})

export function setupFirebaseConnection() {
  return function(dispatch: Dispatch<ReturnType<typeof setRawData>>) {
    init();
    onDataChange(data => dispatch(setRawData(data)));
  }
}   

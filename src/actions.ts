import { init, onDataChange } from "./firebase"
import { ActionType, Team, Result, Axis, Metric, Page, Data } from "./data-model"
import { Dispatch } from "redux"

export const addToTeam = (team: Team, name: string) => ({
  type: ActionType.AddToTeam as ActionType.AddToTeam,
  team: team,
  name: name
})

type AddToTeam = ReturnType<typeof addToTeam>;

export const setResult = (result: Result) => ({
  type: ActionType.SetResult as ActionType.SetResult,
  result: result
})

type SetResult = ReturnType<typeof setResult>;

export const setDate = (date: Date) => ({
  type: ActionType.SetDate as ActionType.SetDate,
  date: date
})

type SetDate = ReturnType<typeof setDate>;

export const setMetric = (axis: Axis, metric: Metric) => ({
  type: ActionType.SetMetric as ActionType.SetMetric,
  axis: axis,
  metric: metric
})

type SetMetric = ReturnType<typeof setMetric>;

export const toggleWindows = (axis: Axis) => ({
  type: ActionType.ToggleWindows as ActionType.ToggleWindows,
  axis: axis
})

type ToggleWindows = ReturnType<typeof toggleWindows>;

export const setWindowSize = (axis: Axis, size: number) => ({
  type: ActionType.SetWindowSize as ActionType.SetWindowSize,
  axis: axis,
  size: size
})

type SetWindowSize = ReturnType<typeof setWindowSize>;

export const toggleEqualTeams = (axis: Axis) => ({
  type: ActionType.ToggleEqualTeams as ActionType.ToggleEqualTeams,
  axis: axis
})

type ToggleEqualTeams = ReturnType<typeof toggleEqualTeams>;

export const setTeamSize = (axis: Axis, size: number) => ({
  type: ActionType.SetTeamSize as ActionType.SetTeamSize,
  axis: axis,
  size: size
})

type SetTeamSize = ReturnType<typeof setTeamSize>;

export const save = () => ({ type: ActionType.Save as ActionType.Save })

type Save = ReturnType<typeof save>;

export const toggleRecentGames = (axis: Axis) => ({
  type: ActionType.ToggleRecentGames as ActionType.ToggleRecentGames,
  axis: axis
})

type ToggleRecentGames = ReturnType<typeof toggleRecentGames>;

export const setRecentGameCount = (axis: Axis, count: number) => ({
  type: ActionType.SetRecentGameCount as ActionType.SetRecentGameCount,
  axis: axis,
  count: count
})

type SetRecentGameCount = ReturnType<typeof setRecentGameCount>;

export const navigate = (page: Page) => ({
  type: ActionType.Navigate as ActionType.Navigate,
  page: page
})

type Navigate = ReturnType<typeof navigate>;

const setRawData = (data: Data) => ({
  type: ActionType.SetRawData as ActionType.SetRawData,
  data: data
})

type SetRawData = ReturnType<typeof setRawData>;

export type Action = AddToTeam | SetResult | SetDate | SetMetric | ToggleWindows | SetWindowSize |
                     ToggleEqualTeams | SetTeamSize | Save | ToggleRecentGames | SetRecentGameCount |
                     Navigate | SetRawData;

export function setupFirebaseConnection() {
  return function(dispatch: Dispatch<ReturnType<typeof setRawData>>) {
    init();
    onDataChange(data => dispatch(setRawData(data)));
  }
}   

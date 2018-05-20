import { Map, List } from "immutable"

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

export interface Record {
  date: string,
  result: Result,
  [Team.A]: string[],
  [Team.B]: string[]
}

export interface Data {
  [key: number]: Record
}

export const initialUiState = Map({
  activePage: Page.Dashboard,
  edit: Map({
    [Team.A]: List(),
    [Team.B]: List(),
    result: Result.TeamAWon,
    date: new Date()
  }),
  dashboard: Map({
    [Axis.X]: Map({
      metric: Metric.Time,
      windows: false,
      windowSize: 6,
      equalTeams: false,
      teamSize: 4,
      recentGames: false,
      recentGameCount: 10
    }),
    [Axis.Y]: Map({
      metric: Metric.EloRating,
      windows: false,
      windowSize: 6,
      equalTeams: false,
      teamSize: 4,
      recentGames: false,
      recentGameCount: 10
    })
  })
});

export type UiState = typeof initialUiState;

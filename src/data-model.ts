import { List } from 'immutable';

export enum ActionType {
  AddToTeam,
  SetResult,
  SetDate,
  Save,
  SetMetric,
  ToggleWindows,
  SetWindowSize,
  ToggleFilter,
  SetFilter,
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
  WinRate = "Win rate",
  EloRating = "Elo rating",
  Time = "Time",
}

export enum Page {
  Dashboard = 'Dashboard',
  Edit = 'New Game',
  List = 'Games',
}

export interface Record {
  date: string,
  result: Result,
  [Team.A]: string[],
  [Team.B]: string[]
}

export type Data = Map<number, Record>;

export enum Filter {
  Equal = 'Teams of eqal size',
  FourVsFour = '4 vs. 4',
  ThreeVsThree = '3 vs. 3',
}

export const initialUiState = {
  activePage: Page.Dashboard,
  edit: {
    [Team.A]: List([]),
    [Team.B]: List([]),
    result: Result.TeamAWon,
    date: new Date()
  },
  dashboard: {
    [Axis.X]: {
      metric: Metric.Time,
      windows: false,
      windowSize: 6,
      filter: true,
      filterValue: Filter.Equal,
      recentGames: false,
      recentGameCount: 10
    },
    [Axis.Y]: {
      metric: Metric.EloRating,
      windows: false,
      windowSize: 6,
      filter: true,
      filterValue: Filter.Equal
    }
  }
};

export type UiState = typeof initialUiState;

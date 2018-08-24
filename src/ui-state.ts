import { observable, runInAction, computed } from 'mobx';
import { Team, Result, Games, Record } from './data-model';
import * as hash from 'object-hash';
import { winRate, eloRating, windowed, transpose } from './metrics';

function normalizeRecord(r: Record) {
  return {
    date: r.date,
    result: r.result,
    [Team.A]: r[Team.A].slice().sort(),
    [Team.B]: r[Team.B].slice().sort()
  }
}

interface ValueRef {
  on: (eventType: string, callback: (snapshot: Any) => void) => void
  set: (value: Any) => void
  ref: (path: string) => ValueRef
  remove: () => void
}

export enum Axis {
  X = 'X',
  Y = 'Y',
}

export enum Metric {
  WinRate = "Win rate",
  EloRating = "Élő rating",
  Time = "Time",
}

export enum Filter {
  Equal = 'Teams of equal size',
  FourVsFour = '4 vs. 4',
  ThreeVsThree = '3 vs. 3',
}

class AxisOptions {
  metric: Metric
  windows = false
  windowSize = 6
  filter = true
  filterValue = Filter.Equal
  recentGames = false
  recentGameCount = 10

  constructor(m: Metric) {
    this.metric = m;
  }
}

export enum Page {
  Dashboard = 'Dashboard',
  Edit = 'New Game',
  List = 'Games',
}

export class UIState {
  private valueRef: ValueRef
  @observable games: Games = new Map();
  @observable page: Page = Page.Dashboard;
  @observable [Axis.X] = new AxisOptions(Metric.Time)
  @observable [Axis.Y] = new AxisOptions(Metric.EloRating)

  constructor(valueRef: ValueRef) {
    this.valueRef = valueRef;
    this.valueRef.on(
      'value',
      snapshot => runInAction(() => this.games = new Map(Object.entries(snapshot.val())))
    );
  };

  addGame(r: Record) {
    const n = normalizeRecord(r);
    const key = `${n.date}-${hash(n)}`;
    this.valueRef.ref(key).set(n);
  }

  removeGame(key: string) {
    this.valueRef.ref(key).remove();
  }

  updateGame(key: string, r: Record) {
    this.removeGame(key);
    this.addGame(r);
  }

  @computed get names() {
    const n = new Set([]);
    for (let [_, record] of this.games) {
      const { [Team.A]: teamA, [Team.B]: teamB } = record;
      const players = [].concat(teamA).concat(teamB);
      for (let player of players) {
        n.add(player);
      }
    }
    return n;
  }

  @computed get sortedGames() {
    return Array.from(this.games.values()).sort((a: Record, b: Record) => a.date > b.date);
  }

  @computed get filteredSortedGamesX() {
    return filteredGames(this[Axis.X].filter, this[Axis.X].filterValue, this.sortedGames);
  }

  @computed get filteredSortedGamesY() {
    return filteredGames(this[Axis.Y].filter, this[Axis.Y].filterValue, this.sortedGames);
  }

  @computed get chartType() {
    if (this[Axis.X].metric == Metric.Time) {
      return 'scatter';
    } else {
      return 'line';
    }
  }
}

function metricFn(metric: Metric) {
  switch (metric) {
    case Metric.EloRating:
      return eloRating;
    case Metric.WinRate:
      return winRage
    default:
      throw new RuntimeException(`Unknown metric ${metric}`);
  }
}

function teamSizeFilter(size: number) {
  return (record: Record) => record[Team.A].length == size && record[Team.B].length == size;
}

const filters = {
  [Filter.Equal]: (record: Record) => record[Team.A].length == record[Team.B].length,
  [Filter.FourVsFour]: teamSizeFilter(4),
  [Filter.FourVsFour]: teamSizeFilter(3)
};

function filteredGames(filter: boolean, filterValue: Filter, games: Record[]) {
  if (filter) {
    return games.filter(filters[filterValue]);
  } else {
    return games;
  }
}

/* function ratings(data: Data, axisStat: XState | YState, names: string[]) {
 *   const metric = metricFn(axisStat.metric);
 *   let records = data.values();
 *   if (axisStat.filter) {
 *     records = data.filter(filters[axisStat.filterValue]);
 *   }
 *   const sortedRecords = records.sort((r1: Record, r2: Record) => r1.date.localCompare(r2.date));
 *   if (axisStat.windows) {
 *     return transpose(windowed(sortedRecords, axis.windowSize, metric, names));
 *   }
 *   return transpose(metric(sortedRecords, names));
 * } */

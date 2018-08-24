import { observable, runInAction, computed } from 'mobx';
import { Team, Result, Games, Record } from './data-model';
import * as hash from 'object-hash';

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

export class UIState {
  private valueRef: ValueRef
  @observable games: Games = new Map();
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
}

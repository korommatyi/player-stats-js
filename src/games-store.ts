import { observable, runInAction, computed } from 'mobx';
import * as hash from 'object-hash';

export enum Team {
  A = "team-a",
  B = "team-b",
}

export enum Result {
  TeamAWon = "team-a-won",
  TeamBWon = "team-b-won",
  Draw = "draw",
}

export interface Record {
  date: string,
  result: Result,
  [Team.A]: string[],
  [Team.B]: string[]
}

function normalizeRecord(r: Record) {
  return {
    date: r.date,
    result: r.result,
    [Team.A]: r[Team.A].slice().sort(),
    [Team.B]: r[Team.B].slice().sort()
  }
}

export type Games = Map<string, Record>;

interface ValueRef {
  on: (eventType: string, callback: (snapshot: Any) => void) => void
  set: (value: Any) => void
  ref: (path: string) => ValueRef
  remove: () => void
}

export class GamesStore {
  private valueRef: ValueRef
  @observable games: Games = new Map();

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

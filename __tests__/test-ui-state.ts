import { UIState } from '../src/ui-state';
import { Games, Result, Team } from '../src/data-model';

class ValueRefMock {
  private data = {};
  private callbacks = [];

  constructor(parent?: ValueRefMock, key?: string) {
    this.parent = parent
    this.key = key
  }

  on(eventType: string, callback: (snapshot: Any) => void) {
    if (this.parent) {
      this.parent.on(eventType, callback)
    } else if (eventType == 'value') {
      this.callbacks.push(callback);
    }
  }

  fireAll() {
    for (let cb of this.callbacks) {
      cb({ val: () => this.data });
    }
  }

  set(value: Any) {
    if (this.parent) {
      this.parent.data[this.key] = value;
      this.parent.fireAll();
    } else {
      this.data = value;
      this.fireAll();
    }
  }

  ref(path: string) {
    return new ValueRefMock(this, path);
  }

  remove() {
    if (this.parent) {
      delete this.parent.data[this.key];
      this.parent.fireAll();
    }
  }
}

test('ValueRefMock', () => {
  const m = new ValueRefMock();
  let data = {};
  m.on('value', s => { data = s.val() });
  m.ref('child').set('hello');
  expect(data.child).toBe('hello');
});

test('addGame works', () => {
  const store = new UIState(new ValueRefMock());
  const record = {
    date: '2018-08-02',
    result: Result.TeamAWon,
    [Team.A]: ['b', 'a'],
    [Team.B]: [],
  };
  store.addGame(record);
  expect(store.games.size).toBe(1);
  expect(store.games.values().next().value[Team.A][0]).toBe('a');
  store.addGame(record);
  expect(store.games.size).toBe(1);
});

test('removeGame works', () => {
  const store = new UIState(new ValueRefMock());
  const record1 = {
    date: '2018-08-02',
    result: Result.TeamAWon,
    [Team.A]: ['b', 'a'],
    [Team.B]: [],
  };
  const record2 = {
    date: '2018-08-03',
    result: Result.TeamAWon,
    [Team.A]: ['b', 'a'],
    [Team.B]: [],
  };
  store.addGame(record1);
  store.addGame(record2);
  expect(store.games.size).toBe(2);
  const keys = Array.from(store.games.keys());
  const oneKey = keys[0];
  const otherKey = keys[1];
  store.removeGame(oneKey);
  expect(store.games.has(otherKey)).toBe(true);
});

test('updateGame works', () => {
  const store = new UIState(new ValueRefMock());
  const record = {
    date: '2018-08-02',
    result: Result.TeamAWon,
    [Team.A]: ['b', 'a'],
    [Team.B]: [],
  };
  store.addGame(record);
  const key = store.games.keys().next().value;
  const updatedRecord = {
    date: '2018-08-02',
    result: Result.TeamAWon,
    [Team.A]: ['a'],
    [Team.B]: [],
  };
  store.updateGame(key, updatedRecord);
  expect(store.games.size).toBe(1);
  expect(store.games.values().next().value[Team.A]).toHaveLength(1);
});

test('names works', () => {
  const store = new UIState(new ValueRefMock());
  const record1 = {
    date: '2018-08-02',
    result: Result.TeamAWon,
    [Team.A]: ['a', 'b'],
    [Team.B]: [],
  };
  const record2 = {
    date: '2018-08-03',
    result: Result.TeamAWon,
    [Team.A]: ['a', 'c'],
    [Team.B]: ['d'],
  };
  store.addGame(record1);
  store.addGame(record2);
  const names = store.names;
  expect(names.size).toBe(4);
  expect(names.has('a')).toBe(true);
  expect(names.has('b')).toBe(true);
  expect(names.has('c')).toBe(true);
  expect(names.has('d')).toBe(true);
});

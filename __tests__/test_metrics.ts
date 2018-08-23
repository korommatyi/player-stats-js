import { winRate, eloRating } from '../src/metrics'
import { Record, Result, Team } from '../src/ui-state'

const records = [
  {
    date: '2018-08-02',
    result: Result.TeamAWon,
    [Team.A]: ['a', 'b'],
    [Team.B]: ['c', 'd']
  },
  {
    date: '2018-08-03',
    result: Result.Draw,
    [Team.A]: ['a', 'c'],
    [Team.B]: ['e']
  }
];

const names = ['a', 'b', 'c', 'd', 'e'];

test('winRate works', () => {
  const result = winRate(records, names);
  expect(result).toHaveLength(2);
  const last = result[1];
  expect(last.get('a')).toBe(0.75);
  expect(last.get('b')).toBe(1);
  expect(last.get('c')).toBe(0.25);
  expect(last.get('d')).toBe(0);
  expect(last.get('e')).toBe(0.5);
});

test('eloRating works', () => {
  const result = eloRating(records, names);
  expect(result).toHaveLength(2);
  const first = result[0];
  expect(first.get('a')).toBe(1516);
  expect(first.get('c')).toBe(1484);
  expect(first.get('e')).toBe(1500);
  const second = result[1];
  expect(second.get('a')).toBeCloseTo(1504, 0);
  expect(second.get('e')).toBeCloseTo(1524, 0);
});

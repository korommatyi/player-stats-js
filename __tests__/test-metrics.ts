import { winRate, eloRating, windowed, transpose } from '../src/metrics'
import { Record, Result, Team } from '../src/data-model'

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
  expect(last.get('a')).toBeCloseTo(0.75, 2);
  expect(last.get('b')).toBeCloseTo(1, 2);
  expect(last.get('c')).toBeCloseTo(0.25, 2);
  expect(last.get('d')).toBeCloseTo(0, 2);
  expect(last.get('e')).toBeCloseTo(0.5, 2);
});

test('eloRating works', () => {
  const result = eloRating(records, names);
  expect(result).toHaveLength(2);
  const first = result[0];
  expect(first.get('a')).toBeCloseTo(1516, 0);
  expect(first.get('c')).toBeCloseTo(1484, 0);
  expect(first.get('e')).toBeCloseTo(1500, 0);
  const second = result[1];
  expect(second.get('a')).toBeCloseTo(1504, 0);
  expect(second.get('e')).toBeCloseTo(1524, 0);
});

test('windowed with not enough data returns single result', () => {
  const result = windowed(records, 3, winRate, names);
  expect(result).toHaveLength(1);
});

test('windowed works', () => {
  const extendedRecords = records.concat([{
    date: '2018-08-04',
    result: Result.TeamBWon,
    [Team.A]: ['b'],
    [Team.B]: ['a']
  }]);
  const result = windowed(extendedRecords, 2, winRate, names);
  expect(result).toHaveLength(2);
  expect(result[0].get('a')).toBeCloseTo(0.75, 2);
  expect(result[1].get('a')).toBeCloseTo(0.75, 2);
  expect(result[0].get('b')).toBeCloseTo(1, 2);
  expect(result[1].get('b')).toBeCloseTo(0, 2);
});

test('transpose works', () => {
  const ratings = winRate(records, names);
  const result = transpose(ratings);
  expect(result).toHaveLength(names.length);
  const aResults = result.find(r => r.label == 'a');
  expect(aResults.data).toHaveLength(2);
  expect(aResults.data[0]).toBeCloseTo(1, 2);
  expect(aResults.data[1]).toBeCloseTo(0.75, 2);
});

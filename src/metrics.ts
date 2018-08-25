import { Record, Result, Team } from './data-model'
import { Map, Seq } from 'immutable';

const teamAWinScore = (record: Record) => {
  switch (record.result) {
    case Result.TeamAWon:
      return 1;
    case Result.TeamBWon:
      return 0;
    default:
      return 0.5
  }
}

type Rating = Map<string, number>;
type MetricCalculator = (records: Record[], names: string[]) => Rating[];

function reductions<T>(records: Record[], update: (a: T, r: Record) => T, init: T) {
  const ret = [init];
  for (let record of records) {
    const lastRating = ret[ret.length - 1];
    ret.push(update(lastRating, record));
  }
  return ret;
}

export function winRate(records: Record[], names: string[]) {
  type Stat = { played: number, won: number };
  const init = Map(names.map((n: string) => [n, { played: 0, won: 0 }]));
  const update = (accumulator: Map<string, Stat>,
                  currentValue: Record) => {
                    const teamAGain = teamAWinScore(currentValue);
                    const teamBGain = 1 - teamAGain;
                    const scores = currentValue[Team.A]
                      .map((n: string) => [n, teamAGain])
                      .concat(currentValue[Team.B].map((n: string) => [n, teamBGain]));
                    return accumulator.withMutations(
                      (m: Map<string, Stat>) => scores.reduce(
                        (a: Map<string, Stat>, [k, v]: [string, number]) =>
                          a.update(k, (s: Stat) => ({ played: s.played + 1, won: s.won + v }))
                        , m)
                    );
                  };
  const stats = reductions(records, update, init).slice(1);
  const ratio = ({ played, won }: { played: number, won: number }) => played ? won / played : 0;
  return stats.map((r: Map<string, Stat>) => r.map(ratio));
}

function teamRating(ratings: Map<string, number>, team: string[]) {
  const update = (accumulator: number,
                  currentValue: string) => accumulator + ratings.get(currentValue);
  return team.reduce(update, 0);
}

export function eloRating(records: Record[], names: string[]) {
  const init = Map(names.map((n: string) => [n, 1500]));
  const update = (accumulator: Map<string, number>, currentValue: Record) => {
    const { [Team.A]: teamA, [Team.B]: teamB } = currentValue;
    const averageTeamSize = (teamA.length + teamB.length) / 2;
    const teamARating = teamRating(accumulator, teamA);
    const teamBRating = teamRating(accumulator, teamB);
    const eA = 1 / (1 + Math.pow(10, (teamBRating - teamARating) / 400));
    const eB = 1 - eA;
    const sA = teamAWinScore(currentValue);
    const sB = 1 - sA;
    const k = 32 * averageTeamSize;
    const aGain = k * (sA - eA) / teamA.length;
    const bGain = k * (sB - eB) / teamB.length;
    const scores: Seq<string, number> = Seq.Keyed(teamA.map((n: string) => [n, aGain])
                                                       .concat(teamB.map((n: string) => [n, bGain])));
    return accumulator.mergeWith((a: number, b: number) => a + b, scores);
  }
  return reductions(records, update, init).slice(1);
}

function windows(records: Record[], windowSize: number): Record[][] {
  if (windowSize > records.length) {
    return [records.slice(0)];
  }
  const wins = [];
  for (let start = 0; start <= records.length - windowSize; ++start) {
    wins.push(records.slice(start, start + windowSize));
  }
  return wins;
}

export function windowed(records: Record[], windowSize: number, metric: MetricCalculator,
                         names: string[]) {
  const recordWindows = windows(records, windowSize);
  return recordWindows.map((rs: Record[]) => metric(rs, names).slice(-1)[0]);
}

type TransposedRating = { label: string, data: number[] }[];

export function transpose(ratings: Rating[]): TransposedRating {
  if (ratings.length == 0) {
    return [];
  }
  const init = Map(ratings[0].map(_ => []));
  const update = (accumulator: Map<string, number[]>, currentValue: Rating) =>
    accumulator.mergeWith((a: number[], b: number[]) => a.concat(b),
                          currentValue.map((val: number) => [val]));
  const t = ratings.reduce(update, init);
  return t.entrySeq().toArray()
          .map(([name, data]: [string, number[]]) => ({ label: name, data: data }));
}

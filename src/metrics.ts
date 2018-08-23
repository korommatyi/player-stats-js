import { Record, Result, Team } from './ui-state'
import { Map } from 'immutable';

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

function reductions(records: Record[], update: (a: Rating, r: Record) => Rating, init: Rating) {
  const ret = [init];
  for (let record of records) {
    const lastRating = ret[ret.length - 1];
    ret.push(update(lastRating, record));
  }
  return ret;
}

export function winRate(records: Record[], names: string[]) {
  type Stat = { played: number, won: number };
  const init = new Map(names.map((n: string) => [n, { played: 0, won: 0 }]));
  const update = (accumulator: Map<string, Stat>,
                  currentValue: Record) => {
                    const teamAGain = teamAWinScore(currentValue);
                    const teamBGain = 1 - teamAGain;
                    const scores = currentValue[Team.A]
                      .map((n: string) => [n, teamAGain])
                      .concat(currentValue[Team.B].map((n: string) => [n, teamBGain]))
                    return accumulator
                      .mergeWith((a: Stat, b: number) => ({ played: a.played + 1, won: a.won + b }),
                                 scores);
                  }
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
  const init = new Map(names.map((n: string) => [n, 1500]));
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
    const scores = teamA.map((n: string) => [n, aGain])
                        .concat(teamB.map((n: string) => [n, bGain]));
    return accumulator.mergeWith((a: number, b: number) => a + b, scores);
  }
  return reductions(records, update, init).slice(1);
}

/* function windows(records: Record[], windowSize: number): Record[][] {
 *   if (windowSize > records.length) {
 *     return [records.slice(0)];
 *   }
 *   const wins = []
 *   for (let start = 0; start <= records.length - windowSize; ++start) {
 *     wins.push(records.slice(start, start + windowSize));
 *   }
 *   return wins;
 * }
 * 
 * function windowed(records: Record[], windowSize: number, metric: MetricCalculator, names: string[]) {
 *   const recordWindows = windows(records, windowSize);
 *   return recordWindows.map((rs: Record[]) => metric(rs, names).slice(-1)[0])
 * }
 * 
 * type TransposedRating = { label: string, data: number[] }[]
 * 
 * function transpose(ratings: Rating[]): TransposedRating {
 *   if (ratings.length == 0) {
 *     return [];
 *   }
 *   const init = new Map(ratings[0].keys().map((n: string) => [n, []]));
 *   const update = (accumulator: Map<string, number[]>, currentValue: Rating) =>
 *     accumulator.mergeWith((a: number[], b: number) => a.push(b), currentValue);
 *   const t = ratings.reduce(update, init);
 *   return Array.from(t.entries()
 *                      .map(([name, data]: [string, number[]]) => { label: name, data: data }));
 * }
 * 
 * function metricFn(metric: Metric) {
 *   switch (metric) {
 *     case Metric.EloRating:
 *       return eloRating;
 *     case Metric.WinRate:
 *       return winRage
 *     default:
 *       throw new RuntimeException(`Unknown metric ${metric}`);
 *   }
 * }
 * 
 * function teamSizeFilter(size: number) {
 *   return (record: Record) => record[Team.A].length == size && record[Team.B].length == size;
 * }
 * 
 * const filters = {
 *   [Filter.Equal]: (record: Record) => record[Team.A].length == record[Team.B].length,
 *   [Filter.FourVsFour]: teamSizeFilter(4),
 *   [Filter.FourVsFour]: teamSizeFilter(3)
 * };
 * 
 * function ratings(data: Data, axisStat: XState | YState, names: string[]) {
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

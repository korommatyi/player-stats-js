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

export type Games = Map<string, Record>;

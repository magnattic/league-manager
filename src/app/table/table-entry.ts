export interface TableEntry {
  playerName: string;
  wins: number;
  draws: number;
  losses: number;
  goalsScored: number;
  goalsConceded: number;
  movement?: string;
}

export const getGoalDifference = (tableEntry: TableEntry) => tableEntry.goalsScored - tableEntry.goalsConceded;

export const getPoints = (tableEntry: TableEntry) => tableEntry.wins * 3 + tableEntry.draws;

export const getPlayed = (tableEntry: TableEntry) => tableEntry.wins + tableEntry.draws + tableEntry.losses;

export const getPointsPerMatch = (tableEntry: TableEntry) => {
  if (getPlayed(tableEntry) === 0) {
    return 0;
  }
  return Math.round((getPoints(tableEntry) / getPlayed(tableEntry)) * 100) / 100;
};

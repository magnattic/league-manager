import { Fixture } from '../src/app/fixtures/fixture';

export const generateFixtures = (players: string[]) => {
  const sortedNames = players.sort();
  const fixtures: Fixture[] = [];
  for (const name1 of sortedNames) {
    for (const name2 of sortedNames.slice().reverse()) {
      if (name1 !== name2) {
        fixtures.push({ teamA: name1, teamB: name2, goalsA: null, goalsB: null, dateEntered: null });
      }
    }
  }
  return fixtures;
};

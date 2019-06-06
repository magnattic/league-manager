import { getTableWithMovement } from './table-calculation';

const fixtures = [
  { teamA: 'Andreas', teamB: 'Steffen', goalsA: 0, goalsB: 0, dateEntered: new Date(2019, 1, 20, 20, 10, 0) },
  { teamA: 'Andreas', teamB: 'Sebastian K.', goalsA: 0, goalsB: 0, dateEntered: new Date(2019, 1, 20, 20, 10, 0) },
  { teamA: 'Andreas', teamB: 'Sebastian B.', goalsA: 0, goalsB: 0, dateEntered: new Date(2019, 1, 20, 20, 10, 0) },
  { teamA: 'Andreas', teamB: 'Rafael', goalsA: 0, goalsB: 0, dateEntered: new Date(2019, 1, 20, 20, 10, 0) },
  { teamA: 'Andreas', teamB: 'Linus', goalsA: 0, goalsB: 0, dateEntered: new Date(2019, 1, 20, 20, 10, 0) },
  { teamA: 'Andreas', teamB: 'Jonte', goalsA: 0, goalsB: 0, dateEntered: new Date(2019, 1, 20, 20, 10, 0) },
  { teamA: 'Andreas', teamB: 'Dominik', goalsA: 0, goalsB: 1, dateEntered: new Date(2019, 1, 20, 20, 10, 0) }
];

describe('table calculation', () => {
  fit('should order the table by points', () => {
    const table = getTableWithMovement(fixtures, { criteria: 'points', ascending: false });
    expect(table[0].points).toBeGreaterThanOrEqual(table[1].points);
  });
});

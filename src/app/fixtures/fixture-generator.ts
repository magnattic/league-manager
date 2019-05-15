import { Fixture } from './fixture';
import { Player } from 'src/app/players/player';

export const generateFixtures = (players: Player[], withRematches: boolean) => {
  const sortedPlayers = players.slice().sort((a, b) => a.name.localeCompare(b.name));
  const fixtures: Fixture[] = [];
  for (const playerA of sortedPlayers) {
    for (const playerB of sortedPlayers.slice().reverse()) {
      if (
        playerA.name !== playerB.name &&
        (withRematches || !fixtures.find(fix => fix.teamB === playerA.name && fix.teamA === playerB.name))
      ) {
        fixtures.push({ teamA: playerA.name, teamB: playerB.name, goalsA: null, goalsB: null, dateEntered: null });
      }
    }
  }
  return fixtures;
};

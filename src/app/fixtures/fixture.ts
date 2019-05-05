import { FixtureResult } from './fixture-result';
import { Player } from '../players/player';

export interface Fixture {
  teamA: string;
  teamB: string;
  goalsA: number;
  goalsB: number;
  matchNumber?: number;
  dateEntered: Date;
}

export function fromJson(json: Fixture): Fixture {
  if (json.matchNumber && !json.dateEntered) {
    json.dateEntered = new Date(json.matchNumber);
  }
  return {
    teamA: json.teamA,
    teamB: json.teamB,
    goalsA: json.goalsA == null ? null : Number(json.goalsA),
    goalsB: json.goalsB == null ? null : Number(json.goalsB),
    dateEntered: json.dateEntered == null ? null : new Date(json.dateEntered),
    matchNumber: json.matchNumber
  };
}

export function isComplete(fixture: Fixture) {
  return Number.isInteger(fixture.goalsA) && Number.isInteger(fixture.goalsB) && fixture.goalsA > -1 && fixture.goalsB > -1;
}

export function hasPlayer(fixture: Fixture, player: Player) {
  return player == null || fixture.teamA === player.name || fixture.teamB === player.name;
}

export function getResult(fixture: Fixture, team: string) {
  let teamGoals: number;
  let otherGoals: number;
  if (fixture.teamA === team) {
    teamGoals = fixture.goalsA;
    otherGoals = fixture.goalsB;
  } else if (fixture.teamB === team) {
    teamGoals = fixture.goalsB;
    otherGoals = fixture.goalsA;
  } else {
    throw new Error('Team did not play.');
  }

  if (teamGoals > otherGoals) {
    return FixtureResult.Win;
  }
  if (teamGoals < otherGoals) {
    return FixtureResult.Loss;
  }
  return FixtureResult.Draw;
}

export function setGoalsA(fixture: Fixture, value: number) {
  const newFixture = { ...fixture, goalsA: value };
  return finalizeMatch(newFixture);
}

export function setGoalsB(fixture: Fixture, value: number) {
  const newFixture = { ...fixture, goalsB: value };
  return finalizeMatch(newFixture);
}

export function finalizeMatch(fixture: Fixture) {
  return {
    ...fixture,
    dateEntered: isComplete(fixture) ? new Date() : null
  };
}

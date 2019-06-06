// import * as fs from 'fs';
// import { Fixture, isComplete } from 'src/app/fixtures/fixture';

// export class FixtureEditor {
//   constructor(private filePath: string, private fixtures: Fixture[], private nextMatchNumber: number) {}

//   public finalizeMatch(teamA: string, teamB: string, goalsA: number, goalsB: number) {
//     const index = this.fixtures.findIndex(fix => fix.teamA === teamA && fix.teamB === teamB);
//     if (index < 0) {
//       throw new Error(`Match not found! ${teamA} vs ${teamB}`);
//     }
//     const fixture = this.fixtures[index];

//     if (isComplete(fixture)) {
//       throw new Error(`Match is already played! ${teamA} vs ${teamB}`);
//     }

//     fixture.goalsA = goalsA;
//     fixture.goalsB = goalsB;
//     fixture.matchNumber = this.nextMatchNumber;
//     // fixture.dateEntered = new Date();

//     if (!isComplete(fixture)) {
//       throw new Error(`Fixture values invalid! goalsA: ${goalsA}, goalsB: ${goalsB}, nextMatchNumber: ${this.nextMatchNumber}`);
//     }

//     this.nextMatchNumber++;
//   }

//   public save() {
//     const fixturesJson = JSON.stringify(this.fixtures, null, 2);

//     const callback = err => {
//       if (err) {
//         return console.log(err);
//       }
//       console.log('writing to ' + this.filePath);
//     };

//     fs.writeFile(this.filePath, fixturesJson + '\n', callback);
//   }
// }

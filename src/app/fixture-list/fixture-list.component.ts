import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormArrayState } from 'ngrx-forms';
import { Fixture, getResult, isComplete, hasPlayer } from '../fixtures/fixture';
import { FixtureResult } from '../fixtures/fixture-result';
import { Player } from '../players/player';

@Component({
  selector: 'lm-fixture-list',
  templateUrl: './fixture-list.component.html',
  styleUrls: ['./fixture-list.component.css']
})
export class FixtureListComponent {
  // @Input() public set fixtures(fixtures: Fixture[]) {
  //   const formGroups = fixtures.map(fix => this.fb.group({ ...fix }));
  //   formGroups.forEach(group =>
  //     group.valueChanges.subscribe((fix: Fixture) => {
  //       console.log(fix, isComplete(fix));
  //       if (isComplete(fix)) {
  //         this.fixtureChanged.emit(fix);
  //       }
  //     })
  //   );
  // }
  @Input() public formState: FormArrayState<Fixture>;
  @Input() public selectedPlayer: Player = null;
  @Input() public title: string;
  @Input() public isReadonly: boolean;
  @Output() public fixtureChanged = new EventEmitter<Fixture>();

  public isResult(fixture: Fixture, result: keyof typeof FixtureResult) {
    if (!this.selectedPlayer || !isComplete(fixture) || !hasPlayer(fixture, this.selectedPlayer)) {
      return false;
    }
    const actualResult = getResult(fixture, this.selectedPlayer.name);
    return actualResult === FixtureResult[result];
  }

  public trackByFixture = (_index: number, item: Fixture) => ({ a: item.teamA, b: item.teamB });
}

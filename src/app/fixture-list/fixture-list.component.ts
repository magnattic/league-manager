import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Fixture, getResult, isComplete } from '../fixtures/fixture';
import { FixtureResult } from '../fixtures/fixture-result';
import { Player } from '../players/player';

@Component({
  selector: 'lm-fixture-list',
  templateUrl: './fixture-list.component.html',
  styleUrls: ['./fixture-list.component.css']
})
export class FixtureListComponent {
  @Input() public fixtures: Fixture[];
  @Input() public selectedPlayer: Player = null;
  @Input() public title: string;
  @Output() public fixtureChanged = new EventEmitter<Fixture>();

  @Input() public loggedInUser: Player;

  public isResult(fixture: Fixture, result: keyof typeof FixtureResult) {
    if (!this.selectedPlayer || !isComplete(fixture)) {
      return false;
    }
    const actualResult = getResult(fixture, this.selectedPlayer.name);
    return actualResult === FixtureResult[result];
  }

  public trackByFixture = (_index: number, item: Fixture) => ({ a: item.teamA, b: item.teamB });
}

import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormArray, FormBuilder } from '@angular/forms';
import { Fixture, getResult, isComplete } from '../fixtures/fixture';
import { FixtureResult } from '../fixtures/fixture-result';
import { Player } from '../players/player';

@Component({
  selector: 'lm-fixture-list',
  templateUrl: './fixture-list.component.html',
  styleUrls: ['./fixture-list.component.css']
})
export class FixtureListComponent {
  @Input() public set fixtures(fixtures: Fixture[]) {
    const formGroups = fixtures.map(fix => this.fb.group({ ...fix }));
    this.formArray = this.fb.array(formGroups);
    formGroups.forEach(group =>
      group.valueChanges.subscribe((fix: Fixture) => {
        console.log(fix, isComplete(fix));
        if (isComplete(fix)) {
          this.fixtureChanged.emit(fix);
        }
      })
    );
  }
  @Input() public selectedPlayer: Player = null;
  @Input() public title: string;
  @Input() public isReadonly: boolean;
  @Output() public fixtureChanged = new EventEmitter<Fixture>();

  constructor(private fb: FormBuilder) {}

  public formArray = new FormArray([]);

  public isResult(fixture: Fixture, result: keyof typeof FixtureResult) {
    if (!this.selectedPlayer || !isComplete(fixture)) {
      return false;
    }
    const actualResult = getResult(fixture, this.selectedPlayer.name);
    return actualResult === FixtureResult[result];
  }

  public trackByFixture = (_index: number, item: Fixture) => ({ a: item.teamA, b: item.teamB });
}

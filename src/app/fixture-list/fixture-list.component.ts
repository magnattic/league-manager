import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Fixture, isComplete, getResult } from '../fixtures/fixture';
import { Observable } from 'rxjs';
import { FixtureResult } from '../fixtures/fixture-result';

@Component({
  selector: 'lm-fixture-list',
  templateUrl: './fixture-list.component.html',
  styleUrls: ['./fixture-list.component.css']
})
export class FixtureListComponent {
  @Input() public fixtures: Fixture[];
  @Input() public searchTerm: string = null;
  @Input() public title: string;
  @Output() public fixtureChanged = new EventEmitter<Fixture>();

  @Input() public isAdmin: boolean;

  public isResult(fixture, result: string) {
    if (!this.searchTerm || !isComplete(fixture)) {
      return false;
    }
    const actualResult = getResult(fixture, this.searchTerm);
    return actualResult === FixtureResult[result];
  }
}

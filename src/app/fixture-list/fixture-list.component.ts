import { Component, OnInit, Input } from '@angular/core';
import { Fixture } from '../fixture';

import { TableCalculatorService } from '../table-calculator.service';
import { FixtureLoaderService } from '../fixture-loader.service';

import { Observable } from 'rxjs';

@Component({
  selector: 'lm-fixture-list',
  templateUrl: './fixture-list.component.html',
  styleUrls: ['./fixture-list.component.css']
})
export class FixtureListComponent implements OnInit {

  fixtures: Fixture[] = [];

  filteredFixtures: Fixture[];

  constructor(private tableCalculator: TableCalculatorService, private fixtureLoader: FixtureLoaderService) {
    fixtureLoader.loadFixtures().subscribe(fixtures => {
      this.fixtures = this.filteredFixtures = fixtures;
      this.sortFixtures();
      this.tableCalculator.updateTable(this.fixtures);
    });
  }

  ngOnInit() {
  }

  @Input() set searchTerm(searchTerm: string) {
    this.filterFixtures(searchTerm);
    this.sortFixtures();
  }

  filterFixtures(term: string) {
    if (term === null) {
      this.filteredFixtures = this.fixtures;
    } else {
      let upperTerm = term.toUpperCase();
      this.filteredFixtures = this.fixtures.filter(fix =>
        fix.teamA.toUpperCase().includes(upperTerm)
        || fix.teamB.toUpperCase().includes(upperTerm));
    }
  }

  sortFixtures() {
    this.filteredFixtures = this.filteredFixtures.sort((a, b) => {
      if (a.matchNumber > b.matchNumber) {
        return -1;
      }
      if (b.matchNumber > a.matchNumber) {
        return 1;
      }
      if (Fixture.isComplete(a) && !Fixture.isComplete(b)) {
        return -1;
      }
      if (Fixture.isComplete(b) && !Fixture.isComplete(a)) {
        return 1;
      }
      return 0;
    });
  }

  onFixtureChange() {
    console.log('change!');
    this.tableCalculator.updateTable(this.fixtures);
  }
}
import { Component, OnInit, Input } from '@angular/core';
import { Fixture } from '../fixture';

import { TableCalculatorService } from '../table-calculator.service';
import { FixtureService } from '../fixture-loader.service';

@Component({
  selector: 'lm-upcoming-matches',
  templateUrl: './upcoming-matches.component.html',
  styleUrls: ['./upcoming-matches.component.css']
})
export class UpcomingMatchesComponent implements OnInit {

  fixtures: Fixture[] = [];

  filteredFixtures: Fixture[];

  constructor(private tableCalculator: TableCalculatorService, private fixtureLoader: FixtureService) {
  }

  ngOnInit() {
    this.fixtureLoader.fixtures$.subscribe(fixtures => {
      this.fixtures = this.filteredFixtures = fixtures;
      this.filterFixtures(null);
    });
  }

  @Input() set searchTerm(searchTerm: string) {
    this.filterFixtures(searchTerm);
  }

  filterFixtures(term: string) {
    if (term === null) {
      this.filteredFixtures = this.fixtures;
    } else {
      this.filteredFixtures = this.fixtures.filter(fix => fix.teamA === term || fix.teamB === term);
    }
    this.filteredFixtures = this.filteredFixtures.filter(fix => !Fixture.isComplete(fix));
  }

  onFixtureChange() {
    this.fixtureLoader.updateFixtures(this.fixtures);
  }
}

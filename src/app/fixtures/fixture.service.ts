import { Injectable } from '@angular/core';
import * as _ from 'lodash';
import { of, ReplaySubject } from 'rxjs';
import { ArrayUtils } from '../utils/ArrayUtils';
import { Fixture } from './fixture';

@Injectable({ providedIn: 'root' })
export class FixtureService {
  public fixtures$ = new ReplaySubject<Fixture[]>(1);
  private fixtures: Fixture[];

  constructor() {}

  init() {
    this.loadFixtures().subscribe(
      fixtures => {
        this.fixtures = fixtures;
        this.fixtures$.next(fixtures);
      },
      err => console.error(err)
    );
  }

  public updateFixtures(fixtures: Fixture[]) {
    this.fixtures = fixtures;
    // this.s3
    //   .uploadFile('fixtures.json', JSON.stringify(fixtures.map(fix => fix.toJsonObject())))
    //   .subscribe(null, null, () => console.log('upload complete'));
    this.fixtures$.next(fixtures);
  }

  public updateResult(fixture: Fixture) {
    const index = this.fixtures.findIndex(x => x.teamA === fixture.teamA && x.teamB === fixture.teamB);
    const newFixtures = ArrayUtils.replaceAt(this.fixtures, index, fixture);
    this.updateFixtures(newFixtures);
  }

  private loadFixtures() {
    // return this.s3
    //   .downloadFile('fixtures.json')
    //   .map(response => JSON.parse(response as string))
    //   .map(jsonFixtures => jsonFixtures.map(jsonFixture => Fixture.fromJson(jsonFixture)));
    return of([]);
  }
}

import { generateFixtures } from './fixture-generator';
import 'jasmine';

describe('generateFixtures', () => {
  it('generates fixtures', () => {
    const players = ['Dominik', 'Linus'];

    const fixtures = generateFixtures(players);
    console.log(fixtures);

    expect(fixtures.length).toBe(2);
  });
});

import { generateFixtures } from './fixture-generator';

describe('generateFixtures', () => {
  it('generates fixtures', () => {
    const players = [{ id: 'dominik', name: 'Dominik' }, { id: 'linus', name: 'Linus' }];

    const fixtures = generateFixtures(players, true);

    expect(fixtures.length).toBe(2);
  });
});

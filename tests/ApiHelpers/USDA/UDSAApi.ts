import USDAApi from '../../../src/ApiHelpers/USDA/USDAApi';
import fetchMock from 'jest-fetch-mock';
import USDASearchResult from '../../Fixtures/USDASearchResult.json';
import USDADetailsByIdResult from '../../Fixtures/USDADetailsResult.json';

describe('open Food Data Api', () => {
  fetchMock.enableMocks();

  beforeEach(() => {
    fetchMock.resetMocks();
  });

  it('correctly formats results from an OFD text search in France locale', async () => {
    expect.assertions(1);

    const api = new USDAApi();

    fetchMock.mockResponseOnce(JSON.stringify(USDASearchResult));

    const results = await api.search('tomato', 0);

    expect(results).toStrictEqual(
      expect.arrayContaining([
        expect.objectContaining({
          description: expect.any(String),
          id: expect.any(String),
          api: 'USDA',
        }),
      ])
    );
  });

  it('correctly gets the details by id from an OFD text search', async () => {
    expect.assertions(1);

    const api = new USDAApi();

    fetchMock.mockResponseOnce(JSON.stringify(USDADetailsByIdResult));

    const results = await api.getDetails('170461');

    expect(results).toStrictEqual(
      expect.objectContaining({
        name: expect.any(String),
        calories: expect.any(Number),
        protein: expect.any(Number),
        fats: expect.any(Number),
        carbs: expect.any(Number),
        portions: expect.arrayContaining([
          expect.objectContaining({
            description: expect.any(String),
            weight: expect.any(Number),
          }),
        ]),
      })
    );
  });
});

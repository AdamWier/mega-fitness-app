import OFDApi from '../../../src/ApiHelpers/OFD/OFDApi';
import fetchMock from 'jest-fetch-mock';
import OFDSearchResult from '../../Fixtures/OFDSearchResponse.json';
import OFDBarcodeSearchResult from '../../Fixtures/OFDBarcodeSearchResult.json';
import OFDDetailsByIdResult from '../../Fixtures/OFDDetailsById.json';
import OFDAlcoholResult from '../../Fixtures/OFDAlcoholResult.json';
import OFDNoResult from '../../Fixtures/OFDNoResult.json';
import OFDResultOnlyGrams from '../../Fixtures/OFDResultOnlyGrams.json';
import OFDNoCalNoKJ from '../../Fixtures/OFDNoCalNoKJ.json';

describe('open Food Data Api', () => {
  fetchMock.enableMocks();

  beforeEach(() => {
    fetchMock.resetMocks();
  });

  it('correctly formats results from an OFD text search in France locale', async () => {
    expect.assertions(1);

    const api = new OFDApi();

    fetchMock.mockResponseOnce(JSON.stringify(OFDSearchResult));

    const results = await api.search('cookies', true);

    expect(results).toStrictEqual(
      expect.arrayContaining([
        expect.objectContaining({
          description: expect.any(String),
          id: expect.any(String),
          api: 'Open Food Data',
        }),
      ])
    );
  });

  it('correctly formats results from a second page of OFD text search', async () => {
    expect.assertions(1);

    const api = new OFDApi();

    fetchMock.mockResponseOnce(JSON.stringify(OFDSearchResult));

    const results = await api.search('cookies', true, 1);

    expect(results).toStrictEqual(
      expect.arrayContaining([
        expect.objectContaining({
          description: expect.any(String),
          id: expect.any(String),
          api: 'Open Food Data',
        }),
      ])
    );
  });

  it('correctly formats results from an OFD barcode search', async () => {
    expect.assertions(1);

    const api = new OFDApi();

    fetchMock.mockResponseOnce(JSON.stringify(OFDBarcodeSearchResult));

    const results = await api.barcodeSearch('5000159344074');

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

  it('correctly gets the details by id from an OFD text search', async () => {
    expect.assertions(1);

    const api = new OFDApi();

    fetchMock.mockResponseOnce(JSON.stringify(OFDDetailsByIdResult));

    const results = await api.getDetails('0076840600021');

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

  it('correctly gets the processes the details of an alcohol OFD result without protein', async () => {
    expect.assertions(1);

    const api = new OFDApi();

    fetchMock.mockResponseOnce(JSON.stringify(OFDAlcoholResult));

    const results = await api.getDetails('75032814');

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

  it('correctly handles no product found for barcode search', async () => {
    expect.assertions(1);

    const api = new OFDApi();

    fetchMock.mockResponseOnce(JSON.stringify(OFDNoResult));

    const results = await api.barcodeSearch('0');

    expect(results).toBeNull();
  });

  it('correctly handles no product found for text search', async () => {
    expect.assertions(1);

    const api = new OFDApi();

    fetchMock.mockResponseOnce(JSON.stringify(OFDNoResult));

    const results = await api.getDetails('yabba dabba do');

    expect(results).toBeNull();
  });

  it('has only grams when other portion types are not available', async () => {
    expect.assertions(1);

    const api = new OFDApi();

    fetchMock.mockResponseOnce(JSON.stringify(OFDResultOnlyGrams));

    const results = await api.getDetails('5449000131805');

    expect(results).toStrictEqual(
      expect.objectContaining({
        name: expect.any(String),
        calories: expect.any(Number),
        protein: expect.any(Number),
        fats: expect.any(Number),
        carbs: expect.any(Number),
        portions: expect.arrayContaining([
          expect.objectContaining({
            description: 'gram',
            weight: 1,
          }),
        ]),
      })
    );
  });

  it('returns undefined is no calories or kj', async () => {
    expect.assertions(1);

    const api = new OFDApi();

    fetchMock.mockResponseOnce(JSON.stringify(OFDNoCalNoKJ));

    const results = await api.getDetails('8002270116544');

    expect(results).toBeUndefined();
  });
});

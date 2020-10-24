import OFDApi from '../../../src/ApiHelpers/OFD/OFDApi';
import fetchMock from 'jest-fetch-mock';
import OFDSearchResult from '../../Fixtures/OFDSearchResponse.json';
import OFDBarcodeSearchResult from '../../Fixtures/OFDBarcodeSearchResult.json';

describe('Open Food Data Api', () => {
  fetchMock.enableMocks();

  beforeEach(() => {
    fetchMock.resetMocks();
  });

  it('correctly formats results from an OFD text search', async () => {
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
});

import * as fs from 'fs';
import * as path from 'path';
import {MyCustomPlugin} from '../../../lib';

jest.mock('fs');
jest.mock('path');

describe('MyCustomPlugin', () => {
  const outputPath = 'mock-output-path';
  const inputs = [
    {
      timestamp: '2023-12-12T00:00:00.000Z',
      duration: 10,
      energy: 10,
      carbon: 2,
    },
    {
      timestamp: '2023-12-12T00:00:10.000Z',
      duration: 30,
      energy: 20,
      carbon: 5,
    },
  ];
  const standardConfig = {
    'output-path': outputPath,
  };
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should create file and directory with correct inputs', async () => {
    const myCustomPlugin = MyCustomPlugin();
    const result = await myCustomPlugin.execute(inputs, standardConfig);

    expect.assertions(3);

    expect(fs.writeFileSync).toHaveBeenCalledTimes(1);
    expect(path.dirname).toHaveBeenCalledTimes(1);
    expect(result).toStrictEqual(inputs);
  });
});

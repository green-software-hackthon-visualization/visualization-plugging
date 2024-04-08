import * as fs from 'fs';
import * as path from 'path';
import {MyCustomPlugin} from '../../../lib';
import {ERRORS} from '../../../lib/utils/errors';

const {InputValidationError, WriteFileError} = ERRORS;

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

  it('should create file and directory with correct inputs when dir is not existed', async () => {
    const mockWriteFileSync = jest
      .spyOn(fs, 'existsSync')
      .mockImplementation(() => false);
    const myCustomPlugin = MyCustomPlugin();
    const result = await myCustomPlugin.execute(inputs, standardConfig);

    expect.assertions(5);

    expect(mockWriteFileSync).toHaveBeenCalledTimes(1);
    expect(fs.mkdirSync).toHaveBeenCalledTimes(1);
    expect(fs.writeFileSync).toHaveBeenCalledTimes(1);
    expect(path.dirname).toHaveBeenCalledTimes(1);
    expect(result).toStrictEqual(inputs);
  });

  it('should create file and directory with correct inputs when dir is existed', async () => {
    const mockWriteFileSync = jest
      .spyOn(fs, 'existsSync')
      .mockImplementation(() => true);
    const myCustomPlugin = MyCustomPlugin();
    const result = await myCustomPlugin.execute(inputs, standardConfig);

    expect.assertions(5);

    expect(mockWriteFileSync).toHaveBeenCalledTimes(1);
    expect(fs.mkdirSync).toHaveBeenCalledTimes(0);
    expect(fs.writeFileSync).toHaveBeenCalledTimes(1);
    expect(path.dirname).toHaveBeenCalledTimes(1);
    expect(result).toStrictEqual(inputs);
  });

  it('throws an error when out put html config is not provided', async () => {
    const myCustomPlugin = MyCustomPlugin();

    const input = [
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

    expect.assertions(2);

    try {
      await myCustomPlugin.execute(input);
    } catch (error) {
      expect(error).toBeInstanceOf(InputValidationError);
      expect(error).toEqual(
        new InputValidationError('Configuration data is missing')
      );
    }
  });

  it('throws an error when a file writing failed', async () => {
    (fs.writeFileSync as jest.Mock).mockImplementation(() => {
      throw new Error('Permission denied');
    });
    const myCustomPlugin = MyCustomPlugin();

    const input = [
      {
        timestamp: '2023-12-12T00:00:00.000Z',
        duration: 10,
      },
    ];

    expect.assertions(2);

    try {
      await myCustomPlugin.execute(input, standardConfig);
    } catch (error) {
      expect(error).toBeInstanceOf(WriteFileError);
      expect(error).toEqual(
        new WriteFileError(
          'Failed to write HTML to mock-output-path Error: Permission denied'
        )
      );
    }
  });
});

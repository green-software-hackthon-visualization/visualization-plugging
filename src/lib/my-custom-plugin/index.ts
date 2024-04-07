import {YourGlobalConfig} from './types';
import {PluginInterface, PluginParams} from '../types/interface';
import * as fs from 'fs';
import * as path from 'path';

export const MyCustomPlugin = (
  globalConfig: YourGlobalConfig
): PluginInterface => {
  const metadata = {
    kind: 'execute',
  };
  const execute = async (inputs: PluginParams[]): Promise<PluginParams[]> => {
    const dirPath = path.join(__dirname, 'outputs');
    const filePath = path.join(__dirname, 'outputs', 'view.html');
    console.log('View html file path: ', filePath);
    const createFile = () => {
      try {
        if (!fs.existsSync(dirPath)) {
          fs.mkdirSync(dirPath);
        }
        if (!fs.existsSync(filePath)) {
          fs.writeFileSync(filePath, '');
          console.log('View html already created');
        } else {
          console.log('View html already existed');
        }
      } catch (err) {
        console.error('Error while creating file:', err);
      }
    };
    createFile();

    function fillFileContent(input: PluginParams) {
      console.log(input);
    }

    return inputs.map(input => {
      fillFileContent(input);
      globalConfig;

      return input;
    });
  };

  return {
    metadata,
    execute,
  };
};

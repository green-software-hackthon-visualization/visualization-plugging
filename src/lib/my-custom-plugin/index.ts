import {YourGlobalConfig} from './types';
import {PluginInterface, PluginParams} from '../types/interface';

export const MyCustomPlugin = (
  globalConfig: YourGlobalConfig
): PluginInterface => {
  const metadata = {
    kind: 'execute',
  };

  /**
   * Start generate html file
   */
  const execute = async (inputs: PluginParams[]): Promise<PluginParams[]> => {
    function generateFile(filePath: string) {
      // Create file in user dir
      console.log(filePath);
    }

    function fillFileContent(input: PluginParams) {
      // Get we needed data from input
      // Start fill file content
      console.log(input);
    }

    const filePath = '';
    generateFile(filePath);
    return inputs.map(input => {
      // Validate input, it is have our needed parameter? (energy, timestamp...)
      // Get generate file path, need considerate this is come from user or us?
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

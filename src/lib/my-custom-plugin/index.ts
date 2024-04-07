import {PluginInterface, PluginParams} from '../types/interface';
import * as fs from 'fs';
import {PathLike} from 'fs';
import * as path from 'path';
import {ConfigParams} from '../types/common';
import {ERRORS} from '../utils/errors';
import {z} from 'zod';
import {validate} from '../utils/validations';

const {WriteFileError, InputValidationError} = ERRORS;

export const MyCustomPlugin = (): PluginInterface => {
  const metadata = {
    kind: 'execute',
  };
  const execute = async (
    inputs: PluginParams[],
    config?: ConfigParams
  ): Promise<PluginParams[]> => {
    const validateConfig = (config?: ConfigParams) => {
      if (!config) {
        throw new InputValidationError('Configuration data is missing');
      }

      const schema = z.object({
        'output-path': z.string(),
      });

      return validate<z.infer<typeof schema>>(schema, config);
    };

    const createFileContent = (inputs: PluginParams) => {
      return inputs.toString();
    };

    const createFile = (
      dirPath: PathLike,
      filePath: PathLike,
      fileContent: any
    ) => {
      try {
        if (!fs.existsSync(dirPath)) {
          fs.mkdirSync(dirPath);
        }
        fs.writeFileSync(filePath, fileContent, {flag: 'w'});
      } catch (err) {
        throw new WriteFileError(
          `Failed to write HTML to ${outputPath} ${err}`
        );
      }
    };
    const validatedConfig = validateConfig(config);
    const {'output-path': outputPath} = validatedConfig;
    const dirPath = path.dirname(outputPath);

    const content = createFileContent(inputs);
    createFile(dirPath, outputPath, content);

    return inputs;
  };

  return {
    metadata,
    execute,
  };
};

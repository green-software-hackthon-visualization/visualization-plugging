import {ZodIssue, ZodIssueCode, ZodSchema} from 'zod';

import {ERRORS} from './errors';

const {InputValidationError} = ERRORS;
const prettifyErrorMessage = (issues: string) => {
  const issuesArray = JSON.parse(issues);

  return issuesArray.map((issue: ZodIssue) => {
    const code = issue.code;
    let {path, message} = issue;

    if (issue.code === ZodIssueCode.invalid_union) {
      message = issue.unionErrors[0].issues[0].message;
      path = issue.unionErrors[0].issues[0].path;
    }

    const fullPath = flattenPath(path);

    if (!fullPath) {
      return message;
    }

    return `"${fullPath}" parameter is ${message.toLowerCase()}. Error code: ${code}.`;
  });
};

/**
 * Flattens an array representing a nested path into a string.
 */
const flattenPath = (path: (string | number)[]): string => {
  const flattenPath = path.map(part =>
    typeof part === 'number' ? `[${part}]` : part
  );
  return flattenPath.join('.');
};

export const validate = <T>(schema: ZodSchema<T>, object: any) => {
  const validationResult = schema.safeParse(object);

  if (!validationResult.success) {
    throw new InputValidationError(
      prettifyErrorMessage(validationResult.error.message)
    );
  }

  return validationResult.data;
};

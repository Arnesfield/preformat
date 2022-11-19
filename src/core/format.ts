import { format as utilFormat, inspect } from 'util';

/**
 * Uses `util.format` and `util.inspect` to format parameters.
 * @param params The parameters to format.
 * @returns The formatted string in an array.
 */
export function format(...params: any[]): string[] {
  if (params.length === 0) {
    return params;
  }
  params = params.map(param => {
    return typeof param === 'string' || typeof param === 'number'
      ? param
      : inspect(param, { colors: true });
  });
  return [utilFormat(...params)];
}

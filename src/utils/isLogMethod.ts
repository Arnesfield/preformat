import { LOG_METHODS } from '../constants';
import { Format, Mode } from '../types/format.types';
import { LogMethod } from '../types/logMethod.types';

/**
 * Check if the format mode is a `LogMethod`.
 * @param mode The format mode.
 * @returns Indicates if `mode` is a `LogMethod`.
 */
export function isLogMethod<T extends Format>(
  mode: Mode<T>
): mode is LogMethod {
  return LOG_METHODS.includes(mode as LogMethod);
}

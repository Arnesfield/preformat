import { LOG_FUNCTIONS } from '../constants';
import { Mode } from '../types/format.types';
import { LogFunction } from '../types/logFunction.types';

/**
 * Check if the format mode is a `LogFunction`.
 * @param mode The format mode.
 * @returns Indicates if `mode` is a `LogFunction`.
 */
export function isLogFunction<T extends string>(
  mode: Mode<T>
): mode is LogFunction {
  /** List of log functions for `console`. */
  return LOG_FUNCTIONS.includes(mode as LogFunction);
}

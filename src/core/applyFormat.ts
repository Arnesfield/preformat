import { Format, FormatValue, Mode } from '../types/format.types';
import { format } from './format';

// NOTE: internal

/**
 * Get the format value of the format mode.
 * @param formatMap The format object.
 * @param mode The format mode.
 * @returns The format.
 */
function getFormat<T extends Format>(formatMap: T, mode: Mode<T>): FormatValue {
  const value: FormatValue = formatMap[mode] ?? formatMap.default;
  return typeof value === 'function' ? value() : value;
}

/**
 * Formats the parameters with the format mode.
 * @param formatMap The format object.
 * @param mode The format mode.
 * @param params The parameters to format.
 * @param force Force formatting even if `params` is empty.
 * @returns The formatted parameters.
 */
export function applyFormat<T extends Format>(
  formatMap: T,
  mode: Mode<T>,
  params: any[],
  force = false
): any[] {
  // format formatValue and first param
  const formatValue: FormatValue =
    force || params.length > 0 ? getFormat(formatMap, mode) : undefined;
  // avoid mutating params
  return typeof formatValue === 'undefined'
    ? params.slice()
    : format(formatValue, ...params.slice(0, 1)).concat(params.slice(1));
}

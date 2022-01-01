import { format } from './format';
import {
  Format,
  FormatValue,
  Handler,
  LogFunction,
  LOG_FUNCTIONS,
  Mode,
  Preformat
} from './types';

/**
 * Check if the format mode is a `LogFunction`.
 * @param mode The format mode.
 * @returns Indicates if `mode` is a `LogFunction`.
 */
export function isLogFunction<T extends string>(
  mode: Mode<T>
): mode is LogFunction {
  return LOG_FUNCTIONS.includes(mode as LogFunction);
}

/**
 * Get the format value of the format mode.
 * @param formatMap The format object.
 * @param mode The format mode.
 * @returns The format.
 */
function getFormat<T extends string>(
  formatMap: Format<T>,
  mode: Mode<T>
): FormatValue {
  const value: FormatValue = formatMap[mode] ?? formatMap.default;
  return typeof value === 'function' ? value() : value;
}

/**
 * Formats the parameters with the format mode.
 * @param formatMap The format object.
 * @param mode The format mode.
 * @param force Force formatting even if `params` is empty.
 * @param params The parameters to format.
 * @returns The formatted parameters.
 */
function applyFormat<T extends string>(
  formatMap: Format<T>,
  mode: Mode<T>,
  force: boolean,
  ...params: any[]
): any[] {
  // format formatValue and first param
  const formatValue: FormatValue =
    force || params.length > 0 ? getFormat(formatMap, mode) : undefined;
  if (typeof formatValue !== 'undefined') {
    params.unshift(...format(formatValue, ...params.splice(0, 1)));
  }
  return params;
}

/**
 * Create the Preformat object.
 * @param value The format value or options.
 * @returns The Preformat object.
 */
export function preformat<T extends string = never>(
  value?: FormatValue | Format<T>
): Preformat<T> {
  const formatMap =
    value !== null && typeof value === 'object' && !Array.isArray(value)
      ? value
      : ({ default: value } as Format<T>);
  const modes: Mode<T>[] = Array.from(
    new Set(Object.keys(formatMap).concat('default', LOG_FUNCTIONS))
  ) as Mode<T>[];
  const logger: Preformat<T> = {} as any;

  const defaultHandler: Handler<T> = (mode, args) => {
    const key = isLogFunction(mode) ? mode : 'log';
    console[key](...args.params);
  };
  let handler: Handler<T> = defaultHandler;

  function handle(callback: Handler<T> | undefined): Preformat<T> {
    handler = callback || defaultHandler;
    return logger;
  }

  Object.defineProperties(logger, {
    force: { enumerable: true, value: {} },
    format: { enumerable: true, value: {} },
    handle: { enumerable: true, value: handle }
  });
  Object.defineProperty(logger.format, 'force', {
    enumerable: true,
    value: {}
  });

  for (const mode of modes) {
    Object.defineProperty(logger.format, mode, {
      enumerable: true,
      value: (...params: any[]) => {
        return applyFormat(formatMap, mode, false, ...params);
      }
    });
    Object.defineProperty(logger.format.force, mode, {
      enumerable: true,
      value: (...params: any[]) => {
        return applyFormat(formatMap, mode, true, ...params);
      }
    });
    Object.defineProperty(logger.force, mode, {
      enumerable: true,
      value: (...params: any[]) => {
        handler(mode, {
          raw: params,
          params: applyFormat(formatMap, mode, true, ...params)
        });
        return logger;
      }
    });
    Object.defineProperty(logger, mode, {
      enumerable: true,
      value: (...params: any[]) => {
        handler(mode, {
          raw: params,
          params: applyFormat(formatMap, mode, false, ...params)
        });
        return logger;
      }
    });
  }

  return logger;
}

export default preformat;

import { LOG_METHODS } from '../constants';
import { Format, FormatValue, Mode } from '../types/format.types';
import { Handler, HandlerArgs } from '../types/handler.types';
import { Preformat, PreformatProps } from '../types/preformat.types';
import { isLogMethod } from '../utils/isLogMethod';
import { applyFormat } from './applyFormat';

function defaultHandler<T extends Format>(mode: Mode<T>, args: HandlerArgs) {
  const key = isLogMethod(mode) ? mode : 'log';
  console[key](...args.params);
}

/**
 * Create the Preformat object.
 * @returns The Preformat object.
 */
export function preformat<T extends Format>(): Preformat<T>;

/**
 * Create the Preformat object.
 * @param value The format value.
 * @returns The Preformat object.
 */
export function preformat<T extends Format>(value: FormatValue): Preformat<T>;

/**
 * Create the Preformat object.
 * @param options The format options.
 * @returns The Preformat object.
 */
export function preformat<T extends Format>(options: T): Preformat<T>;

export function preformat<T extends Format>(
  value?: FormatValue | T
): Preformat<T> {
  const format: T =
    value !== null && typeof value === 'object' && !Array.isArray(value)
      ? value
      : ({ default: value } as T);
  const modes: Mode<T>[] = Array.from(
    new Set(Object.keys(format).concat('default', LOG_METHODS))
  ) as Mode<T>[];
  const logger = {} as Preformat<T>;

  let customHandler: Handler<T> | null | undefined;
  const handler = (mode: Mode<T>, args: HandlerArgs) => {
    typeof customHandler === 'function'
      ? customHandler(mode, args, defaultHandler)
      : defaultHandler(mode, args);
  };

  const handle: PreformatProps<T>['handle'] = callback => {
    customHandler = callback;
    return logger;
  };

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
      value: (...params: any[]) => applyFormat(format, mode, params)
    });
    Object.defineProperty(logger.format.force, mode, {
      enumerable: true,
      value: (...params: any[]) => applyFormat(format, mode, params, true)
    });
    Object.defineProperty(logger, mode, {
      enumerable: true,
      value: (...raw: any[]) => {
        handler(mode, { raw, params: applyFormat(format, mode, raw) });
        return logger;
      }
    });
    Object.defineProperty(logger.force, mode, {
      enumerable: true,
      value: (...raw: any[]) => {
        handler(mode, { raw, params: applyFormat(format, mode, raw, true) });
        return logger;
      }
    });
  }

  return logger;
}

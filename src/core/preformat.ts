import { LOG_FUNCTIONS } from '../constants';
import { Format, FormatValue, Mode } from '../types/format.types';
import { Handler, HandlerArgs } from '../types/handler.types';
import { Preformat, PreformatProps } from '../types/preformat.types';
import { isLogFunction } from '../utils/isLogFunction';
import { applyFormat } from './applyFormat';

function defaultHandler<T extends string>(mode: Mode<T>, args: HandlerArgs) {
  const key = isLogFunction(mode) ? mode : 'log';
  console[key](...args.params);
}

/**
 * Create the Preformat object.
 * @returns The Preformat object.
 */
export function preformat<T extends string = never>(): Preformat<T>;

/**
 * Create the Preformat object.
 * @param value The format value.
 * @returns The Preformat object.
 */
export function preformat<T extends string = never>(
  value: FormatValue
): Preformat<T>;

/**
 * Create the Preformat object.
 * @param options The format options.
 * @returns The Preformat object.
 */
export function preformat<T extends string = never>(
  options: Format<T>
): Preformat<T>;

export function preformat<T extends string = never>(
  value?: FormatValue | Format<T>
): Preformat<T> {
  const format: Format<T> =
    value !== null && typeof value === 'object' && !Array.isArray(value)
      ? value
      : ({ default: value } as Format<T>);
  const modes: Mode<T>[] = Array.from(
    new Set(Object.keys(format).concat('default', LOG_FUNCTIONS))
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

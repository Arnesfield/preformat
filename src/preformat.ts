import { format } from './format';

/** List of log functions for `console`. */
export const LOG_FUNCTIONS = ['debug', 'error', 'info', 'log', 'warn'] as const;

/** Log function type. */
export type LogFunction = typeof LOG_FUNCTIONS[number];

/** Format value types. */
export type FormatValueType =
  | number
  | string
  | boolean
  | bigint
  | symbol
  | undefined
  | null
  | void;

/** The format value. */
export type FormatValue =
  | FormatValueType
  | FormatValueType[]
  | (() => FormatValueType | FormatValueType[]);

/** The format mode. */
export type Mode<T extends string = never> = 'default' | LogFunction | T;

/** The format object. */
export type Format<T extends string = never> = Partial<
  Record<Mode<T>, FormatValue>
>;

/** The format methods for Preformat. */
export type FormatMethods<T extends string = never> = {
  /**
   * Format the `params`.
   * @returns The formatted parameters.
   */
  [key in Mode<T>]: (...params: any[]) => any[];
};

/** The methods for Preformat. */
export type PreformatMethods<T extends string = never> = {
  /**
   * Format the `params` and call the handler.
   * @returns The Preformat object.
   */
  [key in Mode<T>]: (...params: any[]) => Preformat<T>;
};

/** The arguments for the handler function. */
export interface HandlerArgs {
  /** The formatted parameters. */
  params: any[];
  /** The raw parameters. */
  raw: any[];
}

/** The handle function. */
export type Handler<T extends string = never> = (
  mode: Mode<T>,
  args: HandlerArgs
) => void;

/** Additional Preformat object properties and methods. */
export interface PreformatExtras<T extends string = never> {
  /** The format object. */
  readonly format: FormatMethods<T>;
  /**
   * Set the handler function when a Preformat method is called.
   *
   * The callback defaults to a `console` call.
   * Set to `undefined` to use the default callback.
   * @returns The Preformat object.
   */
  handle(callback: Handler<T> | undefined): Preformat<T>;
}

/** The Preformat object. */
export type Preformat<T extends string = never> = PreformatExtras<T> &
  Omit<PreformatMethods<T>, keyof PreformatExtras<T>>;

/**
 * Check if the format mode is a `LogFunction`.
 * @param mode The format mode.
 * @returns Indicates if `mode` is a `LogFunction`.
 */
function isLogFunction<T extends string>(mode: Mode<T>): mode is LogFunction {
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
 * @param params The parameters to format.
 * @returns The formatted parameters.
 */
function applyFormat<T extends string>(
  formatMap: Format<T>,
  mode: Mode<T>,
  ...params: any[]
): any[] {
  // format formatValue and first param
  const formatValue: FormatValue =
    params.length > 0 ? getFormat(formatMap, mode) : undefined;
  if (typeof formatValue !== 'undefined') {
    params.unshift(...format(formatValue, params.shift()));
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
  const formatMethods: FormatMethods<T> = {} as any;

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
    format: { enumerable: true, value: formatMethods },
    handle: { enumerable: true, value: handle }
  });

  for (const mode of modes) {
    Object.defineProperty(formatMethods, mode, {
      enumerable: true,
      value: (...params: any[]) => applyFormat(formatMap, mode, ...params)
    });
    Object.defineProperty(logger, mode, {
      enumerable: true,
      value: (...params: any[]) => {
        handler(mode, {
          raw: params,
          params: applyFormat(formatMap, mode, ...params)
        });
        return logger;
      }
    });
  }

  return logger;
}

export default preformat;

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
export type Methods<
  T extends string = never,
  F extends any[] | (() => any) = any[]
> = Omit<
  {
    [key in Mode<T>]: (
      ...params: any[]
    ) => F extends () => any ? ReturnType<F> : F;
  },
  keyof PreformatExtras<T>
>;

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

/** The format object. */
export type FormatMethods<T extends string = never> = {
  /** Force formatting even if `params` is empty. */
  readonly force: Methods<T>;
} & Methods<T>;

/** Additional Preformat object properties and methods. */
export interface PreformatExtras<T extends string = never> {
  /** Force formatting even if `params` is empty. */
  readonly force: Methods<T, () => Preformat<T>>;
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
  Methods<T, () => Preformat<T>>;

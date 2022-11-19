import { FormatMethods, Mode } from './format.types';
import { Handler } from './handler.types';

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
  keyof PreformatProps<T>
>;

/** Additional Preformat object properties and methods. */
export interface PreformatProps<T extends string = never> {
  /** Force formatting even if `params` is empty. */
  readonly force: Methods<T, () => Preformat<T>>;
  /** The format object. */
  readonly format: FormatMethods<T>;
  /**
   * Set the handler function when a Preformat method is called.
   *
   * The callback defaults to a `console` call.
   * Set to `null` or `undefined` to use the default callback.
   * @returns The Preformat object.
   */
  handle(handler: Handler<T> | null | undefined): Preformat<T>;
}

/** The Preformat object. */
export type Preformat<T extends string = never> = PreformatProps<T> &
  Methods<T, () => Preformat<T>>;

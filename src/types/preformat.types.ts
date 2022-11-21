import { Format } from './format.types';
import { Handler } from './handler.types';
import { LogMethod } from './logMethod.types';

/** Common methods. */
type Methods<T extends Format, R> = {
  [Key in 'default' | LogMethod]: R;
} & Omit<{ [Key in keyof T]: R }, keyof PreformatProps<T>>;

/** The format methods. */
export type FormatMethods<T extends Format = Format> = Methods<
  T,
  (...params: any[]) => any[]
>;

/** The Preformat methods. */
export type PreformatMethods<T extends Format = Format> = Methods<
  T,
  (...params: any[]) => Preformat<T>
>;

/** Additional Preformat object properties and methods. */
export interface PreformatProps<T extends Format = Format> {
  /** Force formatting even if `params` is empty. */
  readonly force: PreformatMethods<T>;
  /** The format object. */
  readonly format: FormatMethods<T> & {
    /** Force formatting even if `params` is empty. */
    readonly force: FormatMethods<T>;
  };
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
export type Preformat<T extends Format = Format> = PreformatProps<T> &
  PreformatMethods<T>;

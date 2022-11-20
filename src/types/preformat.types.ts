import { Format } from './format.types';
import { Handler } from './handler.types';
import { LogMethod } from './logMethod.types';

/** The format methods. */
export type FormatMethods<T extends Format = Format> = {
  [Key in 'default' | LogMethod]: (...params: any[]) => any[];
} & Omit<
  { [Key in keyof T]: (...params: any[]) => any[] },
  keyof PreformatProps<T>
>;

/** The Preformat methods. */
export type PreformatMethods<T extends Format = Format> = {
  [Key in 'default' | LogMethod]: (...params: any[]) => Preformat<T>;
} & Omit<
  { [Key in keyof T]: (...params: any[]) => Preformat<T> },
  keyof PreformatProps<T>
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

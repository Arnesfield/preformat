import { Mode } from './format.types';
import { Handler } from './handler.types';

/** The Preformat method identifiers. */
export type PreformatMethod<T extends string = never> = Exclude<
  Mode<T>,
  keyof PreformatProps<T>
>;

/** The format methods. */
export type FormatMethods<T extends string = never> = {
  [Key in PreformatMethod<T>]: (...params: any[]) => any[];
};

/** The Preformat methods. */
export type PreformatMethods<T extends string = never> = {
  [Key in PreformatMethod<T>]: (...params: any[]) => Preformat<T>;
};

/** Additional Preformat object properties and methods. */
export interface PreformatProps<T extends string = never> {
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
export type Preformat<T extends string = never> = PreformatProps<T> &
  PreformatMethods<T>;

import { LogFunction } from './logFunction.types';
import { Methods } from './preformat.types';

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

/** The format object. */
export type FormatMethods<T extends string = never> = Methods<T> & {
  /** Force formatting even if `params` is empty. */
  readonly force: Methods<T>;
};

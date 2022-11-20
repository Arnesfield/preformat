import { LogMethod } from './logMethod.types';

/** Primitive format value type. */
export type Primitive =
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
  | Primitive
  | Primitive[]
  | (() => Primitive | Primitive[]);

/** The format mode. */
export type Mode<T extends string = never> = 'default' | LogMethod | T;

/** The format object. */
export type Format<T extends string = never> = {
  [Key in Mode<T>]?: FormatValue;
};

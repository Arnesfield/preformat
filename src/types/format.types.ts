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

/** The format object. */
export type Format = {
  [Key in 'default' | LogMethod]?: FormatValue;
} & {
  [Key in string]?: FormatValue;
};

/** The format mode. */
export type Mode<T extends Format = Record<never, never>> =
  | 'default'
  | LogMethod
  | keyof T;

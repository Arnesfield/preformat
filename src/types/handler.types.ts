import { Format, Mode } from './format.types';

/** The arguments for the handler function. */
export interface HandlerArgs {
  /** The formatted parameters. */
  params: any[];
  /** The raw parameters. */
  raw: any[];
}

/** The handler function. */
export type Handler<T extends Format = Format> = (
  mode: Mode<T>,
  args: HandlerArgs,
  defaultHandler: (mode: Mode<T>, args: HandlerArgs) => void
) => void;

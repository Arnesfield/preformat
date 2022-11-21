# preformat

[![npm](https://img.shields.io/npm/v/preformat.svg)](https://www.npmjs.com/package/preformat)
[![Node.js CI](https://github.com/Arnesfield/preformat/workflows/Node.js%20CI/badge.svg)](https://github.com/Arnesfield/preformat/actions?query=workflow%3A"Node.js+CI")

Log with custom formatting.

```javascript
const logger = preformat({ success: '<DONE>' });
logger.log('Hello %s!', 'World');
logger.success('Hello %s!', 'World');
```

```text
Hello World!
<DONE> Hello World!
```

## Installation

```sh
npm install preformat
```

Use the module:

```javascript
// ES6
import preformat from 'preformat';

// CommonJS
const { preformat } = require('preformat');
```

## Usage

### preformat (logger)

The `preformat` function accepts a format value (default format) or an object with format values, and it returns a `Preformat` object (logger).

| Properties                                     | Description                                                                                  | Type                                      |
| ---------------------------------------------- | -------------------------------------------------------------------------------------------- | ----------------------------------------- |
| [logger.force](#loggerforce)                   | Force logging even with no `params`.                                                         | Object, methods return `Preformat` object |
| [logger.format](#loggerformat)                 | Format `params` instead of logging.                                                          | Object, methods return `any[]`            |
| [logger.format.force](#loggerformatforce)      | Force formatting even with no `params`.                                                      | Object, methods return `any[]`            |
| [logger.handle(handler)](#loggerhandlehandler) | Set `handler` callback and override default logging.                                         | Returns `Preformat` object                |
| logger[methods]                                | Default existing format methods: `default`, `log`, `info`, `error`, `warn`, `debug`, `trace` | Returns `Preformat` object                |
| logger.\*                                      | Other custom format methods.                                                                 | Returns `Preformat` object                |

#### Examples

- Basic formatting:

  ```javascript
  const logger = preformat('Prefix:');
  logger.log('Hello %s!', 'World');
  ```

  ```text
  Prefix: Hello World!
  ```

- Formatting with function:

  ```javascript
  const logger = preformat(() => {
    const year = new Date().getFullYear();
    return `[${year}]`;
  });
  logger.log('Hello %s!', 'World');
  ```

  ```text
  [2021] Hello World!
  ```

- Multiple formatting:

  ```javascript
  const logger = preformat({
    default: '[DEFAULT]',
    log: '[LOG]',
    info: '[INFO]',
    error: () => '[ERR]',
    warn: '[WARN]',
    debug: () => {
      const year = new Date().getFullYear();
      return `[DEUBG-${year}]`;
    }
  });
  logger
    .log('Hello %s!', 'World')
    .error('Hello %s!', 'World')
    .debug('Hello %s!', 'World');
  ```

  ```text
  [LOG] Hello World!
  [ERR] Hello World!
  [DEBUG-2021] Hello World!
  ```

- Custom formatting:

  You can apply custom format method names to the object and use them through the `logger`.

  ```javascript
  const logger = preformat({ success: '<DONE>', test: () => '<TEST>' });
  logger.success('Hello %s!', 'World');
  logger.test('Hello %s!', 'World');
  ```

  ```text
  <DONE> Hello World!
  <TEST> Hello World!
  ```

- Formatting with substitution:

  ```javascript
  const logger = preformat({
    default: 'DEFAULT: %s foo',
    error: 'ERROR: %s bar'
  });
  logger.log(200).error(400, 'error').warn('[%d]', 300, 'warn');
  ```

  ```text
  DEFAULT: 200 foo
  ERROR: 400 bar error
  DEFAULT: [300] foo warn
  ```

#### logger.force

The `logger.force` object contains the format methods that will apply the format even if `params` is empty.

By default, the format methods will print out an empty line if there are no `params` similar to `console.log()`, but using `force` will always include the formatting.

```javascript
const logger = preformat({ success: '<DONE>' });
logger.success();
logger.force.success();
logger.success('Hello %s!', 'World');
logger.force.success('Hello %s!', 'World');
```

```text

<DONE>
<DONE> Hello World!
<DONE> Hello World!
```

#### logger.format

The `logger.format` object contains the format methods and each method will return the formatted result (type: `any[]`). Example:

```javascript
const logger = preformat({ success: '<DONE>' });
const output = logger.format.success('Hello %s!', 'World');
console.log(output);
```

```text
[ '<DONE> Hello %s!', 'World' ]
```

#### logger.format.force

The `logger.format.force` object will apply the formatting even without `params`. Its methods will also return the formatted result.

```javascript
const logger = preformat({ success: '<DONE>' });
const value1 = logger.format.success();
const value2 = logger.format.force.success();
console.log(value1);
console.log(value2);
```

```text
[]
[ '<DONE>' ]
```

#### logger.handle(handler)

The `logger.handle` method accepts a callback `handler` to handle the format method call.

By default, it uses `console` to log the formatted parameters. You can override this functionality. Example:

```javascript
const logger = preformat({ success: '<DONE>' });

logger.handle((mode, args, defaultHandler) => {
  // mode is the format method (e.g. log, success, etc.)
  console.log('mode:', mode);
  // args is an object:
  // args.raw contains the raw parameters
  console.log('args.raw:', args.raw);
  // args.params contains the formatted parameters
  console.log('args.params:', args.params);
  // defaultHandler is the default handle function
  defaultHandler(mode, args);
});

logger.success('Hello %s!', 'World');
```

```text
mode: success
args.raw: [ 'Hello %s!', 'World' ]
args.params: [ '<DONE> Hello %s!', 'World' ]
<DONE> Hello World!
```

You can use the default handler again by passing in `null` or `undefined` to the `logger.handle` call:

```javascript
const logger = preformat();
logger.handle(null);
logger.log('Hello %s!', 'World');
```

```text
Hello World!
```

### format

Applies `util.format()` and `util.inspect()` to `params`.

```javascript
import { format } from 'preformat';

const value = format('Hello %s!', 'World', ':)');
console.log(value);
```

```text
[ 'Hello World! :)' ]
```

It will return an array with one string if `params` were provided. Otherwise, it will return an empty array.

```javascript
console.log(format());
```

```text
[]
```

This helps to distinguish empty `params` from `undefined` values.

### isLogMethod

Checks whether a `mode` is part of the default format methods.

```javascript
import { isLogMethod } from 'preformat';

isLogMethod('log'); // true
isLogMethod('success'); // false
```

This can be useful when overriding the default logging via [`logger.handle`](#loggerhandlehandler).

## License

Licensed under the [MIT License](LICENSE).

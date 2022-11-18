# preformat

[![npm](https://img.shields.io/npm/v/@arnesfield/preformat.svg)](https://www.npmjs.com/package/@arnesfield/preformat)
[![Node.js CI](https://github.com/Arnesfield/@arnesfield/preformat/workflows/Node.js%20CI/badge.svg)](https://github.com/Arnesfield/@arnesfield/preformat/actions?query=workflow%3A"Node.js+CI")

Log with custom formatting.

```javascript
const logger = preformat({ success: '[SUCCESS]' });
logger.log('Hello %s!', 'World');
logger.success('Hello %s!', 'World');
```

```text
Hello World!
[SUCCESS] Hello World!
```

The `Preformat` object contains the following format methods by default: `default`, `log`, `info`, `error`, `warn`, `debug`.

## Usage

1. Basic formatting:

   ```javascript
   const logger = preformat('Prefix:');
   logger.log('Hello %s!', 'World');
   ```

   ```text
   Prefix: Hello World!
   ```

2. Formatting with function:

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

3. Multiple formatting:

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

4. Custom formatting:

   ```javascript
   const logger = preformat({ success: '<DONE>' });
   logger.success('Hello %s!', 'World');
   ```

   ```text
   <DONE> Hello World!
   ```

5. Formatting with substitution:

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

### The `format` object

The `logger.format` object contains the both the default and custom format methods.

Each method will return the formatted result. Example:

```javascript
const logger = preformat({ success: '<DONE>' });
const output = logger.format.success('Hello %s!', 'World');
console.log(output);
```

```text
[ '<DONE> Hello %s!', 'World' ]
```

### The `handle` method

The `logger.handle()` method accepts a callback to handle the format method call.

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
args.raw: [ '<DONE> Hello %s!', 'World' ]
args.params: [ '<DONE> Hello %s!', 'World' ]
<DONE> Hello World!
```

You can use the default handler again by passing in `null` or `undefined` to the `handle` call:

```javascript
const logger = preformat();
logger.handle(null);
logger.log('Hello %s!', 'World');
```

```text
Hello World!
```

### The `force` object

The `force` object can be accessed via `logger.force` and `logger.format.force`. It contains the format methods that will apply the format even if `params` is empty.

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

The `logger.format.force` will also apply the formatting without `params`. Its methods will return the formatted result.

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

## License

Licensed under the [MIT License](LICENSE).

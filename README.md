# preformat

Log with custom formatting.

```js
const logger = preformat();
logger.log('Hello %s!', 'World');
// output: Hello World!
```

The `Preformat` object contains the following format methods by default: `default`, `log`, `info`, `error`, `warn`, `debug`.

## Examples

1. Basic formatting:

   ```js
   const logger = preformat('Prefix:');
   logger.log('Hello %s!', 'World');
   // output: Prefix: Hello World!
   ```

2. Formatting with function:

   ```js
   const logger = preformat(() => {
     const year = new Date().getFullYear();
     return `[${year}]`;
   });
   logger.log('Hello %s!', 'World');
   // output: [2021] Hello World!
   ```

3. Multiple formatting:

   ```js
   const logger = preformat({
     default: '[DEFAULT]',
     log: '[LOG]',
     info: '[ERR]',
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
   // output: [LOG] Hello World!
   // output: [ERR] Hello World!
   // output: [DEBUG-2021] Hello World!
   ```

4. Custom formatting:

   ```js
   const logger = preformat({ success: '<DONE>' });
   logger.success('Hello %s!', 'World');
   // output: <DONE> Hello World!
   ```

5. Formatting with substitution:

   ```js
   const logger = preformat({
     default: 'Number: %s yay',
     error: 'Error: %s oof'
   });
   logger.log(200).error(400).warn('[%d]', 300);
   // output: Number: 200 yay
   // output: Error: 400 oof
   // output: Number: [300] yay
   ```

### The `format` object

The `logger.format` object contains the both the default and custom format methods. Each method will return the formatted result. Example:

```js
const logger = preformat({ success: '<DONE>' });
const output = logger.format.success('Hello %s!', 'World');
console.log(output);
// output: ['<DONE> Hello %s!', 'World']
```

### The `handle` method

The `logger.handle()` method accepts a callback to handle the format method call. By default, it uses `console` to log the formatted parameters. You can override this functionality. Example:

```js
const logger = preformat({ success: '<DONE>' });

logger.handle((mode, args) => {
  // mode is the format method (e.g. log, success, etc.)
  console.log('mode:', mode);
  // args is an object:
  // args.raw contains the raw parameters
  console.log('args.raw:', args.raw);
  // args.params contains the formatted parameters
  console.log('args.params:', args.params);
});

logger.success('Hello %s!', 'World');
// output: mode: success
// output: args.raw: ['Hello %s!', 'World']
// output: args.params: ['<DONE> Hello %s!', 'World']
```

You can use the default handler again by passing in `undefined` to the handle call:

```js
const logger = preformat();
logger.handle(undefined);
logger.log('Hello %s!', 'World');
// output: Hello World!
```

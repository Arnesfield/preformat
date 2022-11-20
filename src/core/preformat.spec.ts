import { expect } from 'chai';
import { spy } from 'sinon';
import { LOG_METHODS } from '../constants';
import { Format } from '../types/format.types';
import { Handler } from '../types/handler.types';
import {
  FormatMethods,
  Preformat,
  PreformatMethods
} from '../types/preformat.types';
import { preformat } from './preformat';

function expectLogMethods(value: any) {
  for (const fn of ['default'].concat(LOG_METHODS)) {
    expect(value).to.have.property(fn).which.is.a('function');
  }
}

function expectPreformat(
  getLogger: <T extends Format>(preformat: Preformat<T>) => PreformatMethods<T>
) {
  let handler: Handler<any> | undefined;

  const get = <T extends Format>(preformat: Preformat<T>) => {
    preformat.handle((mode, args, defaultHandler) => {
      expect(mode).to.be.a('string');
      expect(args).to.be.an('object');
      expect(args).to.have.property('raw').which.is.an('array');
      expect(args).to.have.property('params').which.is.an('array');
      expect(defaultHandler).to.be.a('function');
      if (typeof handler === 'function') {
        (handler as Handler<T>)(mode, args, defaultHandler);
      }
    });
    return getLogger(preformat);
  };

  const setHandler = (callback: Handler<any>) => (handler = spy(callback));

  beforeEach(() => {
    handler = undefined;
  });

  it('should return an object with log methods', () => {
    const logger = get(preformat());
    expect(logger).to.be.an('object');
    expectLogMethods(logger);
  });

  it('should handle "default" format', () => {
    const logger = get(preformat({ default: 'Prefix:' }));
    let handlerSpy = setHandler((mode, args) => {
      expect(mode).to.equal('log');
      expect(args.raw).to.deep.equal(['Hello %s!', 'World']);
      expect(args.params).to.deep.equal(['Prefix: Hello %s!', 'World']);
    });
    expect(handlerSpy.calledOnce).to.be.false;
    logger.log('Hello %s!', 'World');
    expect(handlerSpy.calledOnce).to.be.true;

    handlerSpy = setHandler((mode, args) => {
      expect(mode).to.equal('error');
      expect(args.raw).to.deep.equal(['Hello %s!', 'World']);
      expect(args.params).to.deep.equal(['Prefix: Hello %s!', 'World']);
    });
    expect(handlerSpy.calledOnce).to.be.false;
    logger.error('Hello %s!', 'World');
    expect(handlerSpy.calledOnce).to.be.true;
  });

  it('should format based on format values', () => {
    const logger = get(
      preformat({ log: 'Log:', error: () => 'Error:', warn: 'Warn:' })
    );
    let handlerSpy = setHandler((mode, args) => {
      expect(mode).to.equal('log');
      expect(args.raw).to.deep.equal(['Hello %s!', 'World']);
      expect(args.params).to.deep.equal(['Log: Hello %s!', 'World']);
    });
    expect(handlerSpy.calledOnce).to.be.false;
    logger.log('Hello %s!', 'World');
    expect(handlerSpy.calledOnce).to.be.true;

    handlerSpy = setHandler((mode, args) => {
      expect(mode).to.equal('error');
      expect(args.raw).to.deep.equal(['Hello %s!', 'World']);
      expect(args.params).to.deep.equal(['Error: Hello %s!', 'World']);
    });
    expect(handlerSpy.calledOnce).to.be.false;
    logger.error('Hello %s!', 'World');
    expect(handlerSpy.calledOnce).to.be.true;

    handlerSpy = setHandler((mode, args) => {
      expect(mode).to.equal('warn');
      expect(args.raw).to.deep.equal(['Hello %s!', 'World']);
      expect(args.params).to.deep.equal(['Warn: Hello %s!', 'World']);
    });
    expect(handlerSpy.calledOnce).to.be.false;
    logger.warn('Hello %s!', 'World');
    expect(handlerSpy.calledOnce).to.be.true;

    handlerSpy = setHandler((mode, args) => {
      expect(mode).to.equal('info');
      expect(args.raw).to.deep.equal(['Hello %s!', 'World']);
      expect(args.params).to.deep.equal(['Hello %s!', 'World']);
    });
    expect(handlerSpy.calledOnce).to.be.false;
    logger.info('Hello %s!', 'World');
    expect(handlerSpy.calledOnce).to.be.true;
  });

  it('should handle custom format', () => {
    const logger = get(preformat({ success: '<DONE>' }));
    const handlerSpy = setHandler((mode, args) => {
      expect(mode).to.equal('success');
      expect(args.raw).to.deep.equal(['Hello %s!', 'World']);
      expect(args.params).to.deep.equal(['<DONE> Hello %s!', 'World']);
    });
    expect(handlerSpy.calledOnce).to.be.false;
    logger.success('Hello %s!', 'World');
    expect(handlerSpy.calledOnce).to.be.true;
  });
}

function expectFormat(
  get: <T extends Format>(preformat: Preformat<T>) => FormatMethods<T>
) {
  it('should be an object with log methods', () => {
    const logger = preformat();
    expect(logger).to.have.property('format').which.is.an('object');
    expectLogMethods(get(logger));
  });

  it('should not format params without format value', () => {
    const logger = preformat();
    const result = get(logger).log('Hello %s!', 'World');
    expect(result).to.deep.equal(['Hello %s!', 'World']);
  });

  it('should handle "default" format', () => {
    const logger = preformat({ default: 'Prefix:' });
    const result = get(logger).log('Hello %s!', 'World');
    expect(result).to.deep.equal(['Prefix: Hello %s!', 'World']);
  });

  it('should format based on format values', () => {
    const logger = preformat({
      log: 'Log:',
      error: () => 'Error:',
      warn: 'Warn:'
    });
    const l = get(logger);
    const args = ['foo %s', 'bar'];
    expect(l.log(...args)).to.deep.equal(['Log: foo %s', 'bar']);
    expect(l.error(...args)).to.deep.equal(['Error: foo %s', 'bar']);
    expect(l.warn(...args)).to.deep.equal(['Warn: foo %s', 'bar']);
    expect(l.info(...args)).to.deep.equal(['foo %s', 'bar']);
  });

  it('should handle custom format', () => {
    const logger = preformat({ success: '<DONE>' });
    const result = get(logger).success('Hello %s!', 'World');
    expect(result).to.deep.equal(['<DONE> Hello %s!', 'World']);
  });
}

describe('preformat', () => {
  it('should be a function', () => {
    expect(preformat).to.be.a('function');
  });

  expectPreformat(logger => logger);

  it('should not format if no params', () => {
    const logger = preformat<Format>({ log: 'Log:' });
    let handlerSpy = spy<Handler>((mode, args) => {
      expect(mode).to.equal('log');
      expect(args.raw).to.deep.equal([]);
      expect(args.params).to.deep.equal([]);
    });
    logger.handle(handlerSpy);
    expect(handlerSpy.calledOnce).to.be.false;
    logger.log();
    expect(handlerSpy.calledOnce).to.be.true;

    handlerSpy = spy<Handler>((mode, args) => {
      expect(mode).to.equal('log');
      expect(args.raw).to.deep.equal(['Hello %s!', 'World']);
      expect(args.params).to.deep.equal(['Log: Hello %s!', 'World']);
    });
    logger.handle(handlerSpy);
    expect(handlerSpy.calledOnce).to.be.false;
    logger.log('Hello %s!', 'World');
    expect(handlerSpy.calledOnce).to.be.true;
  });

  describe('force', () => {
    expectPreformat(logger => logger.force);

    it('should format even if no params', () => {
      const logger = preformat<Format>({ log: 'Log:' });
      let handlerSpy = spy<Handler>((mode, args) => {
        expect(mode).to.equal('log');
        expect(args.raw).to.deep.equal([]);
        expect(args.params).to.deep.equal(['Log:']);
      });
      logger.handle(handlerSpy);
      expect(handlerSpy.calledOnce).to.be.false;
      logger.force.log();
      expect(handlerSpy.calledOnce).to.be.true;

      handlerSpy = spy<Handler>((mode, args) => {
        expect(mode).to.equal('log');
        expect(args.raw).to.deep.equal(['Hello %s!', 'World']);
        expect(args.params).to.deep.equal(['Log: Hello %s!', 'World']);
      });
      logger.handle(handlerSpy);
      expect(handlerSpy.calledOnce).to.be.false;
      logger.force.log('Hello %s!', 'World');
      expect(handlerSpy.calledOnce).to.be.true;
    });
  });

  describe('format', () => {
    expectFormat(logger => logger.format);

    it('should not format if no params', () => {
      const logger = preformat({ log: 'Log:' });
      expect(logger.format.log()).to.deep.equal([]);
    });

    describe('force', () => {
      expectFormat(logger => logger.format.force);

      it('should format even if no params', () => {
        const logger = preformat({ log: 'Log:' });
        expect(logger.format.force.log()).to.deep.equal(['Log:']);
      });
    });
  });

  describe('handle', () => {
    it('should be a function', () => {
      const logger = preformat();
      expect(logger).to.have.property('handle').which.is.a('function');
    });
    it('should call the callback when set', () => {
      const logger = preformat<Format>({ success: '<DONE>' });
      const handlerSpy = spy<Handler>((mode, args, defaultHandler) => {
        expect(mode).to.be.a('string').that.equals('success');
        expect(args).to.be.an('object');
        expect(args)
          .to.have.property('raw')
          .which.is.an('array')
          .that.deep.equals(['Hello %s!', 'World']);
        expect(args)
          .to.have.property('params')
          .which.is.an('array')
          .that.deep.equals(['<DONE> Hello %s!', 'World']);
        expect(defaultHandler).to.be.a('function');
      });
      logger.handle(handlerSpy);
      expect(handlerSpy.calledOnce).to.be.false;
      logger.success('Hello %s!', 'World');
      expect(handlerSpy.calledOnce).to.be.true;
    });
  });
});

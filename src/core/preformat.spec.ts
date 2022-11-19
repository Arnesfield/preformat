import { expect } from 'chai';
import { spy } from 'sinon';
import { LOG_FUNCTIONS } from '../constants';
import { Handler } from '../types/handler.types';
import { preformat } from './preformat';

function hasLogFunctions(value: any) {
  for (const fn of ['default'].concat(LOG_FUNCTIONS)) {
    expect(value).to.have.property(fn).which.is.a('function');
  }
}

describe('preformat', () => {
  it('should be a function', () => {
    expect(preformat).to.be.a('function');
  });

  it('should return an object with log functions', () => {
    const logger = preformat();
    expect(logger).to.be.an('object');
    hasLogFunctions(logger);
  });

  describe('force', () => {
    it('should be an object with log functions', () => {
      const logger = preformat();
      expect(logger).to.have.property('force').which.is.an('object');
      hasLogFunctions(logger.force);
    });
  });

  describe('format', () => {
    it('should be an object with log functions', () => {
      const logger = preformat();
      expect(logger).to.have.property('format').which.is.an('object');
      hasLogFunctions(logger.format);
    });
  });

  describe('handle', () => {
    it('should be a function', () => {
      const logger = preformat();
      expect(logger).to.have.property('handle').which.is.a('function');
    });
    it('should call the callback when set', () => {
      const logger = preformat({ success: '<DONE>' });
      const handler: Handler<'success'> = (mode, args, defaultHandler) => {
        expect(mode).to.be.a('string');
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
      };
      const handlerSpy = spy(handler);
      logger.handle(handlerSpy);
      expect(handlerSpy.calledOnce).to.be.false;
      logger.success('Hello %s!', 'World');
      expect(handlerSpy.calledOnce).to.be.true;
    });
  });
});

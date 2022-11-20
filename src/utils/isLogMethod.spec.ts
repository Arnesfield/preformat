import { expect } from 'chai';
import { LOG_METHODS } from '../constants';
import { isLogMethod } from './isLogMethod';

describe('isLogMethod', () => {
  it('should check if argument is a log method', () => {
    for (const method of LOG_METHODS) {
      expect(isLogMethod(method)).to.be.true;
    }
    expect(isLogMethod('default')).to.be.false;
  });
});

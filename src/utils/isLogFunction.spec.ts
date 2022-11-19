import { expect } from 'chai';
import { LOG_FUNCTIONS } from '../constants';
import { isLogFunction } from './isLogFunction';

describe('isLogFunction', () => {
  it('should check if argument is a log function', () => {
    for (const fn of LOG_FUNCTIONS) {
      expect(isLogFunction(fn)).to.be.true;
    }
    expect(isLogFunction('default')).to.be.false;
  });
});

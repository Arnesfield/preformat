import { expect } from 'chai';
import { inspect } from 'util';
import { format } from './format';

function expectf(...params: any[]) {
  return expect(format(...params)[0]);
}

function i(v: any) {
  return inspect(v, { colors: true });
}

describe('format', () => {
  it('should be a function', () => {
    expect(format).to.be.a('function');
  });

  it('should handle no params', () => {
    expect(format()).to.have.length(0);
  });

  it('should format with substitution values', () => {
    expectf('foo', 'string').to.equal('foo string');
    expectf('%s', 'foo', 'string').to.equal('foo string');

    expectf(1.5, 'number').to.equal('1.5 number');
    expectf('%d', 1.5, 'number').to.equal('1.5 number');
    expectf('%i', 1.5, 'number').to.equal('1 number');
    expectf('%f', 1.5, 'number').to.equal('1.5 number');

    expectf({}, 'object').to.equal('{} object');
    expectf([], 'array').to.equal('[] array');
    expectf('%o', {}, 'object').to.equal("'{}' object");
    expectf('%o', [], 'array').to.equal("'[]' array");
    expectf('%o', 'foo', 'string').to.equal("'foo' string");
  });

  it('should use util.inspect()', () => {
    expectf(true).to.equal(i(true)).and.not.equal('true');
    expectf('%o', true).to.not.equal(i(true)).and.not.equal('true');

    expectf(null).to.equal(i(null)).and.not.equal('null');
    expectf('%o', null).to.not.equal(i(null)).and.not.equal('null');

    expectf(undefined).to.equal(i(undefined)).and.not.equal('undefined');
    expectf('%o', undefined)
      .to.not.equal(i(undefined))
      .and.not.equal('undefined');

    const symbol = Symbol('name');
    expectf(symbol).to.equal(i(symbol)).and.not.equal('Symbol(name)');
    expectf('%o', symbol).to.not.equal(i(symbol)).and.not.equal('Symbol(name)');
  });
});

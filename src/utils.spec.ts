import { expect } from 'chai';
import * as sinon from 'sinon';
import { Utils } from './utils';

/* eslint-disable @typescript-eslint/no-explicit-any */

class TestBaseClass {
  testInheritedProp = '';
  static testStaticInheritedProp = '';

  constructor() {
    this.testInheritedProp = 'asdf';
  }

  testInheritedFunction() {}

  static testStaticInheritedFunction() {}
}

class TestClass extends TestBaseClass {
  testProp = '';
  static testStaticProp = '';

  constructor() {
    super();
    this.testProp = 'qwer';
  }

  toJSON() {
    return {};
  }

  testFunction() {}

  static testStaticFunction() {}
}

describe('Utils', () => {
  let sandbox: sinon.SinonSandbox;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('classToObject', () => {
    it('should not include toJSON function', () => {
      expect(Utils.classToObject(TestClass).toJSON).to.be.undefined;
    });

    it('should not include constructor', () => {
      expect(Utils.classToObject(TestClass).constructor.toString()).to.include('native code');
    });

    it('should include static property', () => {
      expect(Utils.classToObject(TestClass).testStaticProp).not.to.be.undefined;
    });

    it('should include static function', () => {
      expect(Utils.classToObject(TestClass).testStaticFunction).not.to.be.undefined;
    });

    it('should handle object correctly', () => {
      const obj = {
        prop: 'a',
        func: () => {},
      };

      expect(Utils.classToObject(obj)).to.eql(obj);
    });
  });
});

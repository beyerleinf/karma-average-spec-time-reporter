import {expect} from 'chai';
import * as sinon from 'sinon';
import {specTimeReporterFactory} from './reporter';
import {Utils} from './utils';

/* eslint-disable @typescript-eslint/no-explicit-any */

const baseReporterDecorator = (context: any) => {
  context.write = sinon.stub();
};

const createReporter = (config: any): any => {
  return specTimeReporterFactory(baseReporterDecorator, config);
};

describe('SpecTimeReporter', () => {
  let sandbox: sinon.SinonSandbox;
  let deprecateStub: sinon.SinonStub;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
    deprecateStub = sandbox.stub(Utils, 'deprecate');
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('onRunComplete', () => {
    it('should write message for each browser', () => {
      const reporter = createReporter({});

      const browsersCollection = {
        browsers: [
          {
            id: 'id1',
            name: 'Browser 1',
            lastResult: {
              success: 5,
              failed: 3,
              skipped: 2,
              total: 10,
              totalTime: 1000,
              netTime: 900,
            },
          },
          {
            id: 'id2',
            name: 'Browser 2',
            lastResult: {
              success: 5,
              failed: 3,
              skipped: 2,
              total: 10,
              totalTime: 1100,
              netTime: 1250,
            },
          },
        ],
      };

      reporter.onRunComplete(browsersCollection);

      expect(reporter.write.calledTwice).to.be.true;
      expect(reporter.write.firstCall.args[0]).to.equal(
        'Browser: Browser 1 | Total Time: 900 ms | Average Time: 90.000 ms \n'
      );
      expect(reporter.write.secondCall.args[0]).to.equal(
        'Browser: Browser 2 | Total Time: 1250 ms | Average Time: 125.000 ms \n'
      );
    });

    it('should write message with browserId when showBrowserId is true', () => {
      const reporter = createReporter({specTimeReporter: {showBrowserId: true}});

      const browsersCollection = {
        browsers: [
          {
            id: 'id1',
            name: 'Browser 1',
            lastResult: {
              success: 5,
              failed: 3,
              skipped: 2,
              total: 10,
              totalTime: 1000,
              netTime: 900,
            },
          },
        ],
      };

      reporter.onRunComplete(browsersCollection);

      expect(reporter.write.calledOnce).to.be.true;
      expect(reporter.write.firstCall.args[0]).to.equal(
        'Browser: Browser 1 (id1) | Total Time: 900 ms | Average Time: 90.000 ms \n'
      );
    });

    it('should show deprecate message when showBrowserId is true', () => {
      const reporter = createReporter({specTimeReporter: {showBrowserId: true}});

      const browsersCollection = {
        browsers: [
          {
            id: 'id1',
            name: 'Browser 1',
            lastResult: {
              success: 5,
              failed: 3,
              skipped: 2,
              total: 10,
              totalTime: 1000,
              netTime: 900,
            },
          },
        ],
      };

      reporter.onRunComplete(browsersCollection);

      expect(deprecateStub.calledOnce).to.be.true;
    });

    it('should color average time red when enableThresholds is true and time exceeds max', () => {
      const reporter = createReporter({colors: true, specTimeReporter: {enableThresholds: true, max: 100, warn: 50}});

      const browsersCollection = {
        browsers: [
          {
            id: 'id1',
            name: 'Browser 1',
            lastResult: {
              success: 5,
              failed: 3,
              skipped: 2,
              total: 10,
              totalTime: 1000,
              netTime: 1100,
            },
          },
        ],
      };

      reporter.onRunComplete(browsersCollection);

      expect(reporter.write.calledOnce).to.be.true;
      expect(reporter.write.firstCall.args[0]).to.equal(
        'Browser: Browser 1 | Total Time: 1100 ms | Average Time: \u001b[31m110.000 ms\u001b[39m \n'
      );
    });

    it('should not color average time when enableThresholds is true but colors is false', () => {
      const reporter = createReporter({colors: false, specTimeReporter: {enableThresholds: true, max: 100, warn: 50}});

      const browsersCollection = {
        browsers: [
          {
            id: 'id1',
            name: 'Browser 1',
            lastResult: {
              success: 5,
              failed: 3,
              skipped: 2,
              total: 10,
              totalTime: 1000,
              netTime: 1100,
            },
          },
        ],
      };

      reporter.onRunComplete(browsersCollection);

      expect(reporter.write.calledOnce).to.be.true;
      expect(reporter.write.firstCall.args[0]).to.equal(
        'Browser: Browser 1 | Total Time: 1100 ms | Average Time: 110.000 ms \n'
      );
    });

    it('should color average time yellow when enableThresholds is true and time exceeds warn but does not exceed max', () => {
      const reporter = createReporter({colors: true, specTimeReporter: {enableThresholds: true, max: 100, warn: 50}});

      const browsersCollection = {
        browsers: [
          {
            id: 'id1',
            name: 'Browser 1',
            lastResult: {
              success: 5,
              failed: 3,
              skipped: 2,
              total: 10,
              totalTime: 1000,
              netTime: 600,
            },
          },
        ],
      };

      reporter.onRunComplete(browsersCollection);

      expect(reporter.write.calledOnce).to.be.true;
      expect(reporter.write.firstCall.args[0]).to.equal(
        'Browser: Browser 1 | Total Time: 600 ms | Average Time: \u001b[33m60.000 ms\u001b[39m \n'
      );
    });

    it('should color average time green when enableThresholds is true and time does not exceed warn', () => {
      const reporter = createReporter({colors: true, specTimeReporter: {enableThresholds: true, max: 100, warn: 50}});

      const browsersCollection = {
        browsers: [
          {
            id: 'id1',
            name: 'Browser 1',
            lastResult: {
              success: 5,
              failed: 3,
              skipped: 2,
              total: 10,
              totalTime: 1000,
              netTime: 300,
            },
          },
        ],
      };

      reporter.onRunComplete(browsersCollection);

      expect(reporter.write.calledOnce).to.be.true;
      expect(reporter.write.firstCall.args[0]).to.equal(
        'Browser: Browser 1 | Total Time: 300 ms | Average Time: \u001b[32m30.000 ms\u001b[39m \n'
      );
    });

    it('should write longest spec when showLongestSpec is true', () => {
      const reporter = createReporter({colors: true, specTimeReporter: {showLongestSpec: true}});

      const browser = {
        id: 'id1',
        name: 'Browser 1',
        lastResult: {
          success: 5,
          failed: 3,
          skipped: 2,
          total: 10,
          totalTime: 1000,
          netTime: 300,
        },
      };

      const browsersCollection = {browsers: [browser]};

      reporter.specSuccess(browser, {description: 'Name 1', suite: ['Suite 1', 'Suite 2'], time: 5});
      reporter.specSuccess(browser, {description: 'Name 2', suite: ['Suite 1', 'Suite 2'], time: 50});

      reporter.onRunComplete(browsersCollection);

      expect(reporter.write.calledTwice).to.be.true;
      expect(reporter.write.firstCall.args[0]).to.equal(
        'Browser: Browser 1 | Total Time: 300 ms | Average Time: 30.000 ms \n'
      );
      expect(reporter.write.secondCall.args[0]).to.equal(
        'LONGEST SPEC: Browser: Browser 1 | Name: Suite 1 > Suite 2 > Name 2 (\u001b[31m50.000 ms\u001b[39m) \n'
      );
    });

    it('should write longest spec time when showLongestSpec is true and no longer spec succeeds', () => {
      const reporter = createReporter({colors: true, specTimeReporter: {showLongestSpec: true}});

      const browser = {
        id: 'id1',
        name: 'Browser 1',
        lastResult: {
          success: 5,
          failed: 3,
          skipped: 2,
          total: 10,
          totalTime: 1000,
          netTime: 300,
        },
      };

      const browsersCollection = {browsers: [browser]};

      reporter.specSuccess(browser, {description: 'Name 1', suite: ['Suite 1', 'Suite 2'], time: 5});
      reporter.specSuccess(browser, {description: 'Name 2', suite: ['Suite 1', 'Suite 2'], time: 2});

      reporter.onRunComplete(browsersCollection);

      expect(reporter.write.calledTwice).to.be.true;
      expect(reporter.write.firstCall.args[0]).to.equal(
        'Browser: Browser 1 | Total Time: 300 ms | Average Time: 30.000 ms \n'
      );
      expect(reporter.write.secondCall.args[0]).to.equal(
        'LONGEST SPEC: Browser: Browser 1 | Name: Suite 1 > Suite 2 > Name 1 (\u001b[31m5.000 ms\u001b[39m) \n'
      );
    });

    it('should not times when showLongestSpec is false', () => {
      const reporter = createReporter({colors: true, specTimeReporter: {showLongestSpec: false}});

      const browser = {
        id: 'id1',
        name: 'Browser 1',
        lastResult: {
          success: 5,
          failed: 3,
          skipped: 2,
          total: 10,
          totalTime: 1000,
          netTime: 300,
        },
      };

      reporter.specSuccess(browser, {description: 'Name 1', suite: ['Suite 1', 'Suite 2'], time: 5});

      expect(reporter.lastLongestTime).to.eq(0);
      expect(reporter.lastLongestBrowser).to.eq('');
      expect(reporter.longestSpec).to.be.undefined;
    });

    it('should use default config when none provided', () => {
      const reporter = createReporter({});

      expect(reporter.options).to.eql({});
      expect(reporter.enableColors).to.be.false;
    });

    it('should not write if browsersCollection.browsers is undefined', () => {
      const reporter = createReporter({specTimeReporter: {showLongestSpec: true}});

      reporter.onRunComplete({});

      expect(reporter.write.callCount).to.equal(0);
    });
  });
});

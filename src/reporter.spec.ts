import { expect } from 'chai';
import * as sinon from 'sinon';
import { specTimeReporterFactory } from './reporter';

/* eslint-disable @typescript-eslint/no-explicit-any */

const baseReporterDecorator = (context: any) => {
  context.write = sinon.stub();
};

const createReporter = (config: any): any => {
  return specTimeReporterFactory(baseReporterDecorator, config);
};

describe('SpecTimeReporter', () => {
  let sandbox: sinon.SinonSandbox;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('onRunComplete', () => {
    it('should output correct output - single browser', () => {
      const reporter = createReporter({});

      const browsers = {
        browsers: [
          {
            id: 'id1',
            name: 'Browser 1',
            lastResult: {
              success: 5,
              failed: 3,
              skipped: 2,
              total: 10,
              totalTime: 2000,
              netTime: 1234,
            },
          },
        ],
      };

      reporter.onRunComplete(browsers);

      expect(reporter.write.callCount).to.eql(4);
      expect(reporter.write.getCalls()[0].args[0]).to.eql(
        '============================== Average spec times ==============================\n'
      );
      expect(reporter.write.getCalls()[1].args[0]).to.eql('Browsers:\n');
      expect(reporter.write.getCalls()[2].args[0]).to.eql(
        `\t${browsers.browsers[0].name}: Total Time: 1.234 secs | Average Time: 0.123 secs\n`
      );
      expect(reporter.write.getCalls()[3].args[0]).to.eql(
        '================================================================================\n\n'
      );
    });

    it('should output correct output - multiple browser', () => {
      const reporter = createReporter({});

      const browsers = {
        browsers: [
          {
            id: 'id1',
            name: 'Browser 1',
            lastResult: {
              success: 5,
              failed: 3,
              skipped: 2,
              total: 10,
              totalTime: 2000,
              netTime: 1234,
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
              totalTime: 3500,
              netTime: 2345,
            },
          },
        ],
      };

      reporter.onRunComplete(browsers);

      expect(reporter.write.callCount).to.eql(5);
      expect(reporter.write.getCalls()[0].args[0]).to.eql(
        '============================== Average spec times ==============================\n'
      );
      expect(reporter.write.getCalls()[1].args[0]).to.eql('Browsers:\n');
      expect(reporter.write.getCalls()[2].args[0]).to.eql(
        `\t${browsers.browsers[0].name}: Total Time: 1.234 secs | Average Time: 0.123 secs\n`
      );
      expect(reporter.write.getCalls()[3].args[0]).to.eql(
        `\t${browsers.browsers[1].name}: Total Time: 2.345 secs | Average Time: 0.234 secs\n`
      );
      expect(reporter.write.getCalls()[4].args[0]).to.eql(
        '================================================================================\n\n'
      );
    });

    describe('thresholds', () => {
      it('should color average green when thresholds and colors are enabled and threshold not reached', () => {
        const reporter = createReporter({
          colors: true,
          specTimeReporter: { enableThresholds: true, max: 100, warn: 50 },
        });

        const browsers = {
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

        reporter.onRunComplete(browsers);

        expect(reporter.write.callCount).to.eql(4);
        expect(reporter.write.getCalls()[0].args[0]).to.eql(
          '============================== Average spec times ==============================\n'
        );
        expect(reporter.write.getCalls()[1].args[0]).to.eql('Browsers:\n');
        expect(reporter.write.getCalls()[2].args[0]).to.eql(
          `\t${browsers.browsers[0].name}: Total Time: 0.300 secs | Average Time: \u001b[32m0.030 secs\u001b[39m\n`
        );
        expect(reporter.write.getCalls()[3].args[0]).to.eql(
          '================================================================================\n\n'
        );
      });

      it('should color average yellow when thresholds and colors are enabled and warn threshold is reached', () => {
        const reporter = createReporter({
          colors: true,
          specTimeReporter: { enableThresholds: true, max: 100, warn: 50 },
        });

        const browsers = {
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

        reporter.onRunComplete(browsers);

        expect(reporter.write.callCount).to.eql(4);
        expect(reporter.write.getCalls()[0].args[0]).to.eql(
          '============================== Average spec times ==============================\n'
        );
        expect(reporter.write.getCalls()[1].args[0]).to.eql('Browsers:\n');
        expect(reporter.write.getCalls()[2].args[0]).to.eql(
          `\t${browsers.browsers[0].name}: Total Time: 0.600 secs | Average Time: \u001b[33m0.060 secs\u001b[39m\n`
        );
        expect(reporter.write.getCalls()[3].args[0]).to.eql(
          '================================================================================\n\n'
        );
      });

      it('should color average red when thresholds and colors are enabled and threshold is reached', () => {
        const reporter = createReporter({
          colors: true,
          specTimeReporter: { enableThresholds: true, max: 100, warn: 50 },
        });

        const browsers = {
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

        reporter.onRunComplete(browsers);

        expect(reporter.write.callCount).to.eql(4);
        expect(reporter.write.getCalls()[0].args[0]).to.eql(
          '============================== Average spec times ==============================\n'
        );
        expect(reporter.write.getCalls()[1].args[0]).to.eql('Browsers:\n');
        expect(reporter.write.getCalls()[2].args[0]).to.eql(
          `\t${browsers.browsers[0].name}: Total Time: 1.100 secs | Average Time: \u001b[31m0.110 secs\u001b[39m\n`
        );
        expect(reporter.write.getCalls()[3].args[0]).to.eql(
          '================================================================================\n\n'
        );
      });
    });

    describe('longest spec', () => {
      it('should write longest spec when showLongestSpec is true - colors', () => {
        const reporter = createReporter({
          colors: true,
          specTimeReporter: { showLongestSpec: true },
        });

        const browsers = {
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

        reporter.specSuccess(browsers.browsers[0], { description: 'Name 1', suite: ['Suite 1', 'Suite 2'], time: 5 });
        reporter.specSuccess(browsers.browsers[0], { description: 'Name 2', suite: ['Suite 1', 'Suite 2'], time: 50 });
        reporter.specSuccess(browsers.browsers[0], { description: 'Name 1', suite: ['Suite 1', 'Suite 2'], time: 5 });

        reporter.onRunComplete(browsers);

        expect(reporter.write.callCount).to.eql(6);
        expect(reporter.write.getCalls()[0].args[0]).to.eql(
          '============================== Average spec times ==============================\n'
        );
        expect(reporter.write.getCalls()[1].args[0]).to.eql('Browsers:\n');
        expect(reporter.write.getCalls()[2].args[0]).to.eql(
          `\t${browsers.browsers[0].name}: Total Time: 0.300 secs | Average Time: 0.030 secs\n`
        );
        expect(reporter.write.getCalls()[3].args[0]).to.eql('\nLongest spec:\n');
        expect(reporter.write.getCalls()[4].args[0]).to.eql(
          `\t${browsers.browsers[0].name}: Suite 1 > Suite 2 > Name 2 (\u001b[31m0.050 secs\u001b[39m)\n`
        );
        expect(reporter.write.getCalls()[5].args[0]).to.eql(
          '================================================================================\n\n'
        );
      });

      it('should write longest spec when showLongestSpec is true - no colors', () => {
        const reporter = createReporter({
          specTimeReporter: { showLongestSpec: true },
        });

        const browsers = {
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

        reporter.specSuccess(browsers.browsers[0], { description: 'Name 1', suite: ['Suite 1', 'Suite 2'], time: 5 });
        reporter.specSuccess(browsers.browsers[0], { description: 'Name 2', suite: ['Suite 1', 'Suite 2'], time: 50 });
        reporter.specSuccess(browsers.browsers[0], { description: 'Name 1', suite: ['Suite 1', 'Suite 2'], time: 5 });

        reporter.onRunComplete(browsers);

        expect(reporter.write.callCount).to.eql(6);
        expect(reporter.write.getCalls()[0].args[0]).to.eql(
          '============================== Average spec times ==============================\n'
        );
        expect(reporter.write.getCalls()[1].args[0]).to.eql('Browsers:\n');
        expect(reporter.write.getCalls()[2].args[0]).to.eql(
          `\t${browsers.browsers[0].name}: Total Time: 0.300 secs | Average Time: 0.030 secs\n`
        );
        expect(reporter.write.getCalls()[3].args[0]).to.eql('\nLongest spec:\n');
        expect(reporter.write.getCalls()[4].args[0]).to.eql(
          `\t${browsers.browsers[0].name}: Suite 1 > Suite 2 > Name 2 (0.050 secs)\n`
        );
        expect(reporter.write.getCalls()[5].args[0]).to.eql(
          '================================================================================\n\n'
        );
      });
    });

    describe('deprecations', () => {
      it('should print deprecation when showBrowserId is present in config - colors', () => {
        const reporter = createReporter({ colors: true, specTimeReporter: { showBrowserId: true } });

        const browsers = {
          browsers: [
            {
              id: 'id1',
              name: 'Browser 1',
              lastResult: {
                success: 5,
                failed: 3,
                skipped: 2,
                total: 10,
                totalTime: 2000,
                netTime: 1234,
              },
            },
          ],
        };

        reporter.onRunComplete(browsers);

        expect(reporter.write.callCount).to.eql(5);
        expect(reporter.write.getCalls()[0].args[0]).to.eql(
          '============================== Average spec times ==============================\n'
        );
        expect(reporter.write.getCalls()[1].args[0]).to.eql('Browsers:\n');
        expect(reporter.write.getCalls()[2].args[0]).to.eql(
          `\t${browsers.browsers[0].name}: Total Time: 1.234 secs | Average Time: 0.123 secs\n`
        );
        expect(reporter.write.getCalls()[3].args[0]).to.eql('\u001b[33m\nshowBrowserId is deprecated.\n\u001b[39m');
        expect(reporter.write.getCalls()[4].args[0]).to.eql(
          '================================================================================\n\n'
        );
      });

      it('should print deprecation when showBrowserId is present in config - no colors', () => {
        const reporter = createReporter({ specTimeReporter: { showBrowserId: true } });

        const browsers = {
          browsers: [
            {
              id: 'id1',
              name: 'Browser 1',
              lastResult: {
                success: 5,
                failed: 3,
                skipped: 2,
                total: 10,
                totalTime: 2000,
                netTime: 1234,
              },
            },
          ],
        };

        reporter.onRunComplete(browsers);

        expect(reporter.write.callCount).to.eql(5);
        expect(reporter.write.getCalls()[0].args[0]).to.eql(
          '============================== Average spec times ==============================\n'
        );
        expect(reporter.write.getCalls()[1].args[0]).to.eql('Browsers:\n');
        expect(reporter.write.getCalls()[2].args[0]).to.eql(
          `\t${browsers.browsers[0].name}: Total Time: 1.234 secs | Average Time: 0.123 secs\n`
        );
        expect(reporter.write.getCalls()[3].args[0]).to.eql('\nshowBrowserId is deprecated.\n');
        expect(reporter.write.getCalls()[4].args[0]).to.eql(
          '================================================================================\n\n'
        );
      });
    });

    it('should not count spec times when showLongestSpec is false', () => {
      const reporter = createReporter({ colors: true, specTimeReporter: { showLongestSpec: false } });

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

      reporter.specSuccess(browser, { description: 'Name 1', suite: ['Suite 1', 'Suite 2'], time: 5 });

      expect(reporter.lastLongestTime).to.eql(0);
      expect(reporter.lastLongestBrowser).to.eql('');
      expect(reporter.longestSpec).to.be.undefined;
    });

    it('should use default config when none provided', () => {
      const reporter = createReporter({});

      expect(reporter.options).to.eql({});
      expect(reporter.enableColors).to.be.false;
    });

    it('should not write if browsersCollection.browsers is undefined', () => {
      const reporter = createReporter({ specTimeReporter: { showLongestSpec: true } });

      reporter.onRunComplete({});

      expect(reporter.write.callCount).to.eql(0);
    });
  });
});

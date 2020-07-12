import {Browser, Browsers, SpecResult} from './interfaces/karma';
import {SpecTimeReporterOptions} from './interfaces/spec-time-reporter-options';
import {Utils} from './utils';

const COLORS: {[key: string]: [number, number]} = {
  red: [31, 39],
  yellow: [33, 39],
  green: [32, 39],
};

class SpecTimeReporter {
  static $inject = ['baseReporterDecorator', 'config'];

  static options: SpecTimeReporterOptions;
  static enableColors: boolean;

  static lastLongestTime = 0;
  static lastLongestBrowser = '';
  static longestSpec: SpecResult;

  static onRunComplete(browsers: Browsers) {
    if (browsers.browsers) {
      for (const browser of browsers.browsers) {
        /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
        (this as any).write(this.buildString(browser));
      }

      if (this.options.showLongestSpec) {
        const fractions = [];

        fractions.push('LONGEST SPEC:');
        fractions.push(`Browser: ${this.lastLongestBrowser}`);
        fractions.push('|');
        fractions.push('Name:');

        for (const suite of this.longestSpec.suite) {
          fractions.push(`${suite} >`);
        }

        fractions.push(this.longestSpec.description);
        fractions.push(`(${this.getColoredString(`${this.longestSpec.time.toFixed(3)} ms`, COLORS.red)})`);
        fractions.push('\n');

        /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
        (this as any).write(fractions.join(' '));
      }
    }
  }

  static specSuccess(browser: Browser, result: SpecResult) {
    if (this.options.showLongestSpec) {
      if (result.time >= this.lastLongestTime) {
        this.lastLongestTime = result.time;
        this.lastLongestBrowser = browser.name;
        this.longestSpec = result;
      }
    }
  }

  private static buildString(browser: Browser) {
    const fractions = [];

    fractions.push(`Browser: ${browser.name}`);

    if (this.options.showBrowserId) {
      Utils.deprecate(
        'showBrowserId will be deprecated in the next release. The browser ID will not be shown anymore.'
      );
      fractions.push(`(${browser.id})`);
    }

    fractions.push('|', `Total Time: ${browser.lastResult.netTime} ms`, '|');

    const avg = browser.lastResult.netTime / browser.lastResult.total;
    let averageTimeString;

    if (this.options.enableThresholds) {
      if (avg < this.options.warn) {
        averageTimeString = this.getColoredString(`${avg.toFixed(3)} ms`, COLORS.green);
      } else if (avg > this.options.warn && avg < this.options.max) {
        averageTimeString = this.getColoredString(`${avg.toFixed(3)} ms`, COLORS.yellow);
      } else {
        averageTimeString = this.getColoredString(`${avg.toFixed(3)} ms`, COLORS.red);
      }
    } else {
      averageTimeString = `${avg.toFixed(3)} ms`;
    }

    fractions.push(`Average Time: ${averageTimeString}`);
    fractions.push('\n');

    return fractions.join(' ');
  }

  private static getColoredString(arg: string, color: [number, number]) {
    if (this.enableColors) {
      return `\u001b[${color[0]}m${arg}\u001b[${color[1]}m`;
    }

    return arg;
  }
}

/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
export function specTimeReporterFactory(baseReporterDecorator: Function, config: any) {
  const base = {};
  baseReporterDecorator(base);
  const reporter = Utils.classToObject(SpecTimeReporter);

  return Object.assign(base, reporter, {options: config.specTimeReporter || {}, enableColors: config.colors || false});
}

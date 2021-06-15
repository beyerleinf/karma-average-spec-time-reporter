import { Browser, Browsers, SpecResult } from './interfaces/karma';
import { SpecTimeReporterOptions } from './interfaces/spec-time-reporter-options';
import { Utils } from './utils';

const COLORS: { [key: string]: [number, number] } = {
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
      this.print('============================== Average spec times ==============================\n');
      this.print('Browsers:\n');

      for (const browser of browsers.browsers) {
        this.printBrowserString(browser);
      }

      if (this.options.showLongestSpec) {
        this.print('\nLongest spec:\n');
        const longestSpecName = [];

        for (const suite of this.longestSpec.suite) {
          longestSpecName.push(`${suite} >`);
        }

        longestSpecName.push(this.longestSpec.description);

        const longestSpecTime = `(${this.getColoredString(
          `${(this.longestSpec.time / 1000).toFixed(3)} secs`,
          COLORS.red
        )})`;

        this.print(`\t${this.lastLongestBrowser}: ${longestSpecName.join(' ')} ${longestSpecTime}\n`);
      }

      this.printDeprecations();

      this.print('================================================================================\n\n');
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

  private static printBrowserString(browser: Browser) {
    const avg = browser.lastResult.netTime / browser.lastResult.total;
    let averageTimeString;

    const avgTimeString = `${(avg / 1000).toFixed(3)} secs`;

    if (this.options.enableThresholds) {
      if (avg < this.options.warn) {
        averageTimeString = this.getColoredString(avgTimeString, COLORS.green);
      } else if (avg > this.options.warn && avg < this.options.max) {
        averageTimeString = this.getColoredString(avgTimeString, COLORS.yellow);
      } else {
        averageTimeString = this.getColoredString(avgTimeString, COLORS.red);
      }
    } else {
      averageTimeString = avgTimeString;
    }

    const browserNetTime = (browser.lastResult.netTime / 1000).toFixed(3);

    this.print(`\t${browser.name}: Total Time: ${browserNetTime} secs | Average Time: ${averageTimeString}\n`);
  }

  private static getColoredString(arg: string, color: [number, number]) {
    if (this.enableColors) {
      return `\u001b[${color[0]}m${arg}\u001b[${color[1]}m`;
    }

    return arg;
  }

  private static printDeprecations() {
    if (this.options.showBrowserId) {
      this.print(this.getColoredString('\nshowBrowserId is deprecated.\n', COLORS.yellow));
    }
  }

  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  private static print(...args: any[]) {
    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
    (this as any).write(...args);
  }
}

/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
export function specTimeReporterFactory(baseReporterDecorator: Function, config: any) {
  const base = {};
  baseReporterDecorator(base);
  const reporter = Utils.classToObject(SpecTimeReporter);

  return Object.assign(base, reporter, {
    options: config.specTimeReporter || {},
    enableColors: config.colors || false,
  });
}

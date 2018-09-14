const c = require('ansi-colors')

const SpecTimeReporter = function(baseReporterDecorator, config) {
  baseReporterDecorator(this);

  const reporterConfig = config.specTimeReporter || {};

  let lastLongestTime = 0;
  let lastLongestBrowser = '';
  let lastLongestSpecResult;

  const buildString = (browser) => {
    const fractions = [];

    fractions.push(`Browser: ${browser.name}`);

    if (reporterConfig.showBrowserId) {
      fractions.push(`(${browser.id})`);
    }

    fractions.push('|');
    fractions.push(`Total Time: ${browser.lastResult.netTime} ms`);
    fractions.push('|');

    const avg = browser.lastResult.netTime / browser.lastResult.total;
    let averageTimeString;

    if (reporterConfig.enableThresholds) {
      if (avg < reporterConfig.warn) {
        averageTimeString = c.green(`${avg} ms`)
      } else if (avg > reporterConfig.warn && avg < reporterConfig.max) {
        averageTimeString = c.yellow(`${avg} ms`)
      } else {
        averageTimeString = c.red(`${avg} ms`)
      }
    } else {
      averageTimeString = `${avg} ms`;
    }

    fractions.push(`Average Time: ${averageTimeString}`);
    fractions.push('\n');

    return fractions.join(' ');
  };

  this.onRunComplete = function(browsersCollection) {
    for (const browser of browsersCollection.browsers) {
      this.write(buildString(browser));
    }

    if (reporterConfig.showLongestSpec) {
      const fractions = [];

      fractions.push('LONGEST SPEC:');
      fractions.push(`Browser: ${lastLongestBrowser}`);
      fractions.push('|');
      fractions.push(`Name:`);

      for (const suite of lastLongestSpecResult.suite) {
        fractions.push(`${suite} >`);
      }

      fractions.push(lastLongestSpecResult.fullName);
      fractions.push('(' + c.red(`${lastLongestSpecResult.time} ms`) + ')');
      fractions.push('\n');

      this.write(fractions.join(' '));
    }
  };

  if (reporterConfig.showLongestSpec) {
    this.specSuccess = (browser, result) => {
      if (result.time >= lastLongestTime) {
        lastLongestTime = result.time;
        lastLongestBrowser = browser.name;
        lastLongestSpecResult = result;
      }
    };
  }
};

SpecTimeReporter.$inject = ['baseReporterDecorator', 'config']

module.exports = {
  'reporter:spec-time': ['type', SpecTimeReporter]
}
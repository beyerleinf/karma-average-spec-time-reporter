# karma-average-spec-time-reporter

[![Greenkeeper badge](https://badges.greenkeeper.io/beyerleinf/karma-average-spec-time-reporter.svg)](https://greenkeeper.io/)

A Karma Reporter that reports the average time per spec.

| Node Version | Linux | Windows |
| ----- | ----- | ----- |
|6|[![Build1][1]][11]|[![Build1][6]][11]|
|7|[![Build1][2]][11]|[![Build1][7]][11]|
|8|[![Build1][3]][11]|[![Build1][8]][11]|
|9|[![Build1][4]][11]|[![Build1][9]][11]|
|10|[![Build1][5]][11]|[![Build1][10]][11]|

[1]: https://travis-matrix-badges.herokuapp.com/repos/beyerleinf/karma-average-spec-time-reporter/branches/master/1
[2]: https://travis-matrix-badges.herokuapp.com/repos/beyerleinf/karma-average-spec-time-reporter/branches/master/1
[3]: https://travis-matrix-badges.herokuapp.com/repos/beyerleinf/karma-average-spec-time-reporter/branches/master/2
[4]: https://travis-matrix-badges.herokuapp.com/repos/beyerleinf/karma-average-spec-time-reporter/branches/master/3
[5]: https://travis-matrix-badges.herokuapp.com/repos/beyerleinf/karma-average-spec-time-reporter/branches/master/4
[6]: https://travis-matrix-badges.herokuapp.com/repos/beyerleinf/karma-average-spec-time-reporter/branches/master/5
[7]: https://travis-matrix-badges.herokuapp.com/repos/beyerleinf/karma-average-spec-time-reporter/branches/master/7
[8]: https://travis-matrix-badges.herokuapp.com/repos/beyerleinf/karma-average-spec-time-reporter/branches/master/8
[9]: https://travis-matrix-badges.herokuapp.com/repos/beyerleinf/karma-average-spec-time-reporter/branches/master/9
[10]: https://travis-matrix-badges.herokuapp.com/repos/beyerleinf/karma-average-spec-time-reporter/branches/master/10
[11]: https://travis-ci.org/beyerleinf/karma-average-spec-time-reporter

## Installation

``` shell
npm i --save-dev karma-average-spec-time-reporter
```

## Usage

`karma.conf.js`
``` js
config.set({
  plugins: [
    require('karma-average-spec-time-reporter')
  ],
  reporters: ['spec-time']
});
```

## Config

`karma.conf.js`
``` js
config.set({
  specTimeReporter: {
    showBrowserId: true,
    showLongestSpec: true,
    enableThresholds: true,
    max: 500,
    warn: 250
  }
});
```

|property|explanation|
|-----|-----|
|`showBrowserId`|Show the ID of the browser. For debugging purposes.|
|`showLongestSpec`|Show the spec that took the longest including the browser in ran in.|
|`enableThresholds`|Color the average time based on provided thresholds. If it doesn't exceed any thresholds it's colored green when this is enabled.|
|`max`|If the average exceeds this amount of ms the average time will be colored red. `enableThresholds` must be `true`.|
|`warn`|If the average exceeds this amount of ms the average time will be colored yellow. `enableThresholds` must be `true`.|

# karma-average-spec-time-reporter

> A Karma Reporter that reports the average time per spec.

[![Maintenance](https://img.shields.io/maintenance/yes/2022style=flat-square)](https://github.com/beyerleinf/karma-average-spec-time-reporter)
[![npm](https://img.shields.io/npm/v/karma-average-spec-time-reporter?style=flat-square)](https://www.npmjs.com/package/karma-average-spec-time-reporter)
[![GitHub Workflow Status](https://img.shields.io/github/workflow/status/beyerleinf/karma-average-spec-time-reporter/CI?style=flat-square)](https://travis-ci.org/beyerleinf/karma-average-spec-time-reporter)
[![Codecov](https://img.shields.io/codecov/c/github/beyerleinf/karma-average-spec-time-reporter?style=flat-square)](https://codecov.io/gh/beyerleinf/karma-average-spec-time-reporter)
[![Known Vulnerabilities](https://snyk.io/test/github/beyerleinf/karma-average-spec-time-reporter/badge.svg?style=flat-square)](https://snyk.io/test/github/beyerleinf/karma-average-spec-time-reporter)

## Installation

```shell
npm i -D karma-average-spec-time-reporter
```

## Usage

```js
// karma.conf.js
config.set({
  plugins: [require('karma-average-spec-time-reporter')],
  reporters: ['spec-time'],
});
```

## Config

```js
// karma.conf.js
config.set({
  specTimeReporter: {
    showLongestSpec: true,
    enableThresholds: true,
    max: 500,
    warn: 250,
  },
});
```

| property           | explanation                                                                                                                       |
| ------------------ | --------------------------------------------------------------------------------------------------------------------------------- |
| `showLongestSpec`  | Show the spec that took the longest including the browser in ran in.                                                              |
| `enableThresholds` | Color the average time based on provided thresholds. If it doesn't exceed any thresholds it's colored green when this is enabled. |
| `max`              | If the average exceeds this amount of ms the average time will be colored red. `enableThresholds` must be `true`.                 |
| `warn`             | If the average exceeds this amount of ms the average time will be colored yellow. `enableThresholds` must be `true`.              |

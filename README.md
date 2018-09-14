# karma-average-spec-time-reporter
A Karma Reporter that reports the average time per spec.

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
    showLongestSpec: true,
    enableThresholds: true,
    max: 500,
    warn: 250
  }
});
```

|property|explanation|
|-----|-----|
|`showLongestSpec`|Show the spec that took the longest including the browser in ran in.|
|`enableThresholds`|Color the average time based on provided thresholds. If it doesn't exceed any thresholds it's colored green when this is enabled.|
|`max`|If the average exceeds this amount of ms the average time will be colored red. `enableThresholds` must be `true`.|
|`warn`|If the average exceeds this amount of ms the average time will be colored yellow. `enableThresholds` must be `true`.|

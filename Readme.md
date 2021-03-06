# Micron Runner
Run your performance benchmark easier than ever.


### Installation:

```
npm i --save micron-runner
```

or global

```
npm i --save  -g micron-runner
```

## Usage:
run with [default params](#defaults).
```
micron-runnner
```
with some custom params:
```
micron-runner --end 10100 --step 1000
```
require a `tests` folder, example:
```
── tests
    ├── console-log.js
    └── stdout.js
```

help:
```
micron-runner --h
```
```

█▀▄▀█ ▄█ ▄█▄    █▄▄▄▄ ████▄    ▄     ▄
█ █ █ ██ █▀ ▀▄  █  ▄▀ █   █     █   █
█ ▄ █ ██ █   ▀  █▀▀▌  █   █ ██   █ █
█   █ ▐█ █▄  ▄▀ █  █  ▀████ █ █  █ █
   █   ▐ ▀███▀    █         █  █ █
  ▀              ▀          █   ██ ▀


Micron - benchmark runner

  Run your performance benchmark easier than ever.

Options

  --folder dir        The input folder.
  --start integer     Initial amount of executions in the loop.
  --end integer       End amount of executions in the loop.
  --step integer      Step from start to end.
  --repeats integer   Reapets for each loop.
  --outdir path       Outdir for save results.
  --help              Print this usage guide.

Examples

  Basic Example:   $ micron test
  With Args:       $ micron test --start 200 --end 2200 --step 500 -r 3


```
### Defaults:
default configuration values
```
  start: 100
  end: 2100
  step: 500
  repeats: 3
  folder: 'tests'
  outdir: 'results'
  verbose: false
```
## Test file format:
Example: `tests/index.js`
```
function beforeAll() {
  //do somethink
}
function test() {
  //do somethink
}
function afterAll() {
  //do somethink
}
module.exports = {
  beforeAll,
  test,
  adterAll
}
```
# Example:
code example [HERE](https://github.com/ivanhuay/micron-runner-example).

view results [HERE](https://ivanhuay.github.io/micron-runner-example/)


## Changelog
* v0.0.12: Fixed labels to general chart.
* v0.0.11: Axis labels added & fixed loop label.
* v0.0.4: test folder validation added.
* v0.0.5: fix results html template.
* v0.0.6: fix stdout in micron.js file.

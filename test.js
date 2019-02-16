
const Micron = require('./micron');
const runner = new Micron({endPoint:600});

runner
  .run()
  .then((response) => {
      runner.writeResults(response);
  });

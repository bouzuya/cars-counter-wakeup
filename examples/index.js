require('../lib/')
  .default()
  .then((counts) => console.log(counts), (error) => console.error(error));

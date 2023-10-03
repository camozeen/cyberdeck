const blessed = require('blessed');

let initialized = false;
let instance;

module.exports.getInstance = async () => {
  if (initialized) {
    return instance;
  }
  instance = blessed.screen({
    smartCSR: true,
    dockBorders: true
  });
  initialized = true;
  return instance;
};

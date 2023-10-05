const blessed = require('blessed');

let initialized = false;
let instance;

module.exports.getInstance = async (root) => {
  if (initialized) {
    return instance;
  }
  instance = blessed.box({
    parent: root,
    top: 0,
    right: 0,
    width: '70%',
    height: '100%',
    hidden: true,
  });
  initialized = true;
  return instance;
};

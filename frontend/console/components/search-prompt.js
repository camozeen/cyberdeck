const blessed = require('blessed');

let initialized = false;
let instance;

module.exports.getInstance = async (root) => {
  if (initialized) {
    return instance;
  }
  instance = blessed.prompt({
    parent: root,
    top: 'center',
    left: 'center',
    height: 'shrink',
    width: 'shrink',
    keys: true,
    vi: true,
    mouse: true,
    tags: true,
    border: 'line',
    hidden: true
  });
  initialized = true;
  return instance;
};
